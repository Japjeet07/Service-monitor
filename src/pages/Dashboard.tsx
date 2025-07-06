
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service } from '@/types/service';
import { apiService } from '@/services/api';
import { ServiceTable } from '@/components/ServiceTable';
import { ServiceForm } from '@/components/ServiceForm';
import { DeleteServiceDialog } from '@/components/DeleteServiceDialog';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [deletingService, setDeletingService] = useState<Service | undefined>();
  const [isVisible, setIsVisible] = useState(true);

  // Handle visibility change for fresh data on tab return
  useEffect(() => {
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      setIsVisible(nowVisible);
      
      if (nowVisible) {
        // Immediately refetch when tab becomes visible
        queryClient.invalidateQueries({ queryKey: ['services'] });
        queryClient.invalidateQueries({ queryKey: ['service-statuses'] });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);

  // Fetch initial services data
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: apiService.getServices,
    staleTime: 5 * 60 * 1000, // Services change infrequently
    refetchOnWindowFocus: false // We handle this manually
  });

  // Fetch status updates separately for efficiency
  const { data: statusUpdates } = useQuery({
    queryKey: ['service-statuses'],
    queryFn: apiService.getServiceStatuses,
    refetchInterval: isVisible ? 15000 : false, // Poll every 15 seconds when visible
    refetchIntervalInBackground: false,
    staleTime: 0 // Always consider status data stale
  });

  // Merge services with latest status updates
  const servicesWithUpdatedStatus = services.map(service => {
    const statusUpdate = statusUpdates?.find(update => update.id === service.id);
    return statusUpdate ? { ...service, ...statusUpdate } : service;
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: apiService.createService,
    onMutate: async (newService) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['services'] });
      const previousServices = queryClient.getQueryData<Service[]>(['services']);
      
      const optimisticService: Service = {
        ...newService,
        id: `temp-${Date.now()}`,
        lastChecked: new Date().toISOString()
      };
      
      queryClient.setQueryData<Service[]>(['services'], old => 
        old ? [...old, optimisticService] : [optimisticService]
      );
      
      return { previousServices };
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context?.previousServices) {
        queryClient.setQueryData(['services'], context.previousServices);
      }
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Success",
        description: "Service created successfully!",
      });
      setIsFormOpen(false);
      setEditingService(undefined);
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Service> }) => 
      apiService.updateService(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['services'] });
      const previousServices = queryClient.getQueryData<Service[]>(['services']);
      
      queryClient.setQueryData<Service[]>(['services'], old => 
        old ? old.map(service => 
          service.id === id ? { ...service, ...updates } : service
        ) : []
      );
      
      return { previousServices };
    },
    onError: (error, variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(['services'], context.previousServices);
      }
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Success",
        description: "Service updated successfully!",
      });
      setIsFormOpen(false);
      setEditingService(undefined);
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: apiService.deleteService,
    onMutate: async (serviceId) => {
      await queryClient.cancelQueries({ queryKey: ['services'] });
      const previousServices = queryClient.getQueryData<Service[]>(['services']);
      
      queryClient.setQueryData<Service[]>(['services'], old => 
        old ? old.filter(service => service.id !== serviceId) : []
      );
      
      return { previousServices };
    },
    onError: (error, variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(['services'], context.previousServices);
      }
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Success",
        description: "Service deleted successfully!",
      });
      setIsDeleteDialogOpen(false);
      setDeletingService(undefined);
    }
  });

  const handleServiceClick = (service: Service) => {
    navigate(`/service/${service.id}`);
  };

  const handleAddService = () => {
    setEditingService(undefined);
    setIsFormOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setDeletingService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (serviceData: Omit<Service, 'id' | 'lastChecked'>) => {
    if (editingService) {
      updateServiceMutation.mutate({
        id: editingService.id,
        updates: serviceData
      });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingService) {
      deleteServiceMutation.mutate(deletingService.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <ServiceTable
          services={servicesWithUpdatedStatus}
          onServiceClick={handleServiceClick}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          onAddService={handleAddService}
          isLoading={servicesLoading}
        />

        <ServiceForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingService(undefined);
          }}
          onSubmit={handleFormSubmit}
          service={editingService}
          isLoading={createServiceMutation.isPending || updateServiceMutation.isPending}
        />

        <DeleteServiceDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingService(undefined);
          }}
          onConfirm={handleDeleteConfirm}
          service={deletingService}
          isLoading={deleteServiceMutation.isPending}
        />
      </div>
    </div>
  );
};
