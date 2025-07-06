
import { useState } from 'react';
import { Service } from '@/types/service';
import { StatusBadge } from './StatusBadge';
import { ServiceTypeIcon } from './ServiceTypeIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceTableProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onAddService: () => void;
  isLoading?: boolean;
}

export const ServiceTable = ({ 
  services, 
  onServiceClick, 
  onEditService, 
  onDeleteService, 
  onAddService,
  isLoading 
}: ServiceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getResponseTimeColor = (responseTime?: number) => {
    if (!responseTime) return 'text-gray-400';
    if (responseTime < 100) return 'text-green-600';
    if (responseTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) return 'N/A';
    return `${responseTime}ms`;
  };

  const formatLastChecked = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with enhanced styling */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Service Monitor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Monitor and manage your infrastructure services</p>
        </div>
        <Button 
          onClick={onAddService} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0 bg-white/60 focus:bg-white transition-all duration-300 focus:shadow-md"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-0 bg-white/60 focus:bg-white transition-all duration-300">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
              <SelectItem value="Degraded">Degraded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Enhanced Service Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-3">
                      <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl font-medium">No services found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <Card 
                key={service.id} 
                className={cn(
                  "group p-6 transition-all duration-500 cursor-pointer border-0 shadow-md hover:shadow-2xl",
                  "bg-gradient-to-r from-white to-gray-50/50 hover:from-white hover:to-blue-50/30",
                  "transform hover:scale-[1.02] hover:-translate-y-1",
                  "animate-fade-in"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                onClick={() => onServiceClick(service)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                        "bg-gradient-to-bl from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100",
                        "group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <ServiceTypeIcon 
                          type={service.type} 
                          className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" 
                        />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate text-lg group-hover:text-blue-900 transition-colors duration-300">
                          {service.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-white/60 border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300"
                        >
                          {service.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate mb-3 group-hover:text-gray-600 transition-colors duration-300">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-6 text-xs">
                        <span className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                          Last checked: {formatLastChecked(service.lastChecked)}
                        </span>
                        <span className={cn(
                          getResponseTimeColor(service.responseTime),
                          "font-medium transition-all duration-300"
                        )}>
                          Response: {formatResponseTime(service.responseTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                      <StatusBadge status={service.status} />
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditService(service);
                        }}
                        className="h-9 w-9 p-0 hover:bg-blue-100 hover:scale-110 transition-all duration-200"
                      >
                        <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteService(service);
                        }}
                        className="h-9 w-9 p-0 hover:bg-red-100 hover:scale-110 transition-all duration-200"
                      >
                        <Trash className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-white to-gray-50/30 border-0 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { 
              count: services.filter(s => s.status === 'Online').length, 
              label: 'Online', 
              color: 'text-green-600',
              bg: 'bg-green-100',
              icon: '●'
            },
            { 
              count: services.filter(s => s.status === 'Degraded').length, 
              label: 'Degraded', 
              color: 'text-yellow-600',
              bg: 'bg-yellow-100',
              icon: '●'
            },
            { 
              count: services.filter(s => s.status === 'Offline').length, 
              label: 'Offline', 
              color: 'text-red-600',
              bg: 'bg-red-100',
              icon: '●'
            },
            { 
              count: services.length, 
              label: 'Total', 
              color: 'text-gray-900',
              bg: 'bg-gray-100',
              icon: '#'
            }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className={cn(
                "text-center p-4 rounded-xl transition-all duration-500 hover:scale-105 cursor-default",
                stat.bg,
                "animate-fade-in"
              )}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className={cn("text-3xl font-bold mb-1", stat.color)}>
                {stat.count}
              </div>
              <div className="text-sm text-gray-600 font-medium flex items-center justify-center space-x-1">
                <span className={cn("text-lg", stat.color)}>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
