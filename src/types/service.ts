
export interface Service {
  id: string;
  name: string;
  type: 'API' | 'Database' | 'Queue' | 'Cache' | 'Storage';
  status: 'Online' | 'Offline' | 'Degraded';
  url?: string;
  description?: string;
  lastChecked: string;
  responseTime?: number;
}

export interface ServiceEvent {
  id: string;
  serviceId: string;
  status: 'Online' | 'Offline' | 'Degraded';
  timestamp: string;
  message: string;
  duration?: number;
}

export interface ServiceWithEvents extends Service {
  events: ServiceEvent[];
}
