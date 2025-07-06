
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { ServiceTypeIcon } from '@/components/ServiceTypeIcon';
import { ArrowLeft, Clock, Globe, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  // Handle visibility change for fresh data on tab return
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => apiService.getService(id!),
    enabled: !!id,
    refetchOnWindowFocus: isVisible,
    staleTime: 0
  });

  const {
    data: eventsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: eventsLoading
  } = useInfiniteQuery({
    queryKey: ['service-events', id],
    queryFn: ({ pageParam = 0 }) => apiService.getServiceEvents(id!, pageParam),
    enabled: !!id,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined;
    },
    initialPageParam: 0
  });

  const events = eventsData?.pages.flat() || [];

  const formatEventTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventIcon = (status: string) => {
    const config = {
      Online: { color: 'bg-green-500', pulse: 'animate-pulse' },
      Offline: { color: 'bg-red-500', pulse: '' },
      Degraded: { color: 'bg-yellow-500', pulse: 'animate-pulse' }
    }[status] || { color: 'bg-gray-400', pulse: '' };

    return (
      <div className="relative">
        <div className={cn("w-3 h-3 rounded-full", config.color)}></div>
        {config.pulse && (
          <div className={cn("absolute inset-0 w-3 h-3 rounded-full opacity-75", config.color, config.pulse)} />
        )}
      </div>
    );
  };

  if (serviceLoading && !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          <Card className="p-8 animate-pulse bg-gradient-to-r from-white to-gray-50 border-0 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-4">
                <div className="w-64 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
                <div className="w-96 h-4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <Card className="p-12 text-center bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Service Not Found</h2>
            <p className="text-gray-600 mb-8 text-lg">The service you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Enhanced Service Details */}
        <Card className="p-8 bg-gradient-to-r from-white to-gray-50/30 border-0 shadow-xl">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start space-x-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500",
                "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100",
                "hover:scale-110 hover:rotate-3"
              )}>
                <ServiceTypeIcon type={service.type} className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
              </div>
              
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                  {service.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge 
                    variant="outline" 
                    className="bg-white/60 border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                  >
                    {service.type}
                  </Badge>
                  <div className="transform transition-transform duration-300 hover:scale-110">
                    <StatusBadge status={service.status} />
                  </div>
                </div>
                <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                
                {service.url && (
                  <div className="flex items-center space-x-3 text-gray-500 hover:text-blue-600 transition-colors duration-300">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">{service.url}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            {[
              {
                value: service.responseTime ? `${service.responseTime}ms` : 'N/A',
                label: 'Response Time',
                icon: TrendingUp,
                color: service.responseTime && service.responseTime < 100 ? 'text-green-600' : 
                       service.responseTime && service.responseTime < 500 ? 'text-yellow-600' : 'text-red-600'
              },
              {
                value: new Date(service.lastChecked).toLocaleDateString(),
                label: 'Last Checked',
                icon: Clock,
                color: 'text-blue-600'
              },
              {
                value: events.length.toString(),
                label: 'Total Events',
                icon: Activity,
                color: 'text-purple-600'
              }
            ].map((metric, index) => (
              <div 
                key={metric.label}
                className={cn(
                  "text-center p-6 rounded-xl bg-white/60 hover:bg-white transition-all duration-500",
                  "hover:scale-105 hover:shadow-lg cursor-default animate-fade-in"
                )}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="flex justify-center mb-3">
                  <div className={cn("w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center", metric.color)}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={cn("text-3xl font-bold mb-2", metric.color)}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Enhanced Events Timeline */}
        <Card className="p-8 bg-gradient-to-r from-white to-gray-50/30 border-0 shadow-xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Event History
            </h2>
          </div>

          {eventsLoading && events.length === 0 ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-6 animate-pulse bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl">No events recorded for this service</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className={cn(
                    "flex items-center space-x-4 p-6 rounded-xl transition-all duration-500 hover:scale-[1.02] cursor-default",
                    "animate-fade-in",
                    event.status === 'Online' && "bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50",
                    event.status === 'Offline' && "bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50",
                    event.status === 'Degraded' && "bg-gradient-to-r from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex-shrink-0">
                    {getEventIcon(event.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="transform transition-transform duration-300 hover:scale-105">
                        <StatusBadge status={event.status as any} showIcon={false} />
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {formatEventTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{event.message}</p>
                    {event.duration && (
                      <p className="text-sm text-gray-500 mt-2">
                        Duration: {Math.floor(event.duration / 60000)} minutes
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Enhanced Load More Button */}
              {hasNextPage && (
                <div className="text-center pt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white"
                  >
                    {isFetchingNextPage ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Load More Events'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
