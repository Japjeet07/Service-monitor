
// Mock API service for demonstration
// In a real application, this would connect to your actual backend

import { Service, ServiceEvent } from '@/types/service';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'User Authentication API',
    type: 'API',
    status: 'Online',
    url: 'https://api.monitocorp.com/auth',
    description: 'Handles user login and authentication',
    lastChecked: new Date().toISOString(),
    responseTime: 120
  },
  {
    id: '2',
    name: 'Main Database',
    type: 'Database',
    status: 'Online',
    url: 'postgres://db.monitocorp.com:5432',
    description: 'Primary PostgreSQL database',
    lastChecked: new Date().toISOString(),
    responseTime: 45
  },
  {
    id: '3',
    name: 'Redis Cache',
    type: 'Cache',
    status: 'Degraded',
    url: 'redis://cache.monitocorp.com:6379',
    description: 'Session and data caching layer',
    lastChecked: new Date().toISOString(),
    responseTime: 250
  },
  {
    id: '4',
    name: 'Email Queue',
    type: 'Queue',
    status: 'Offline',
    url: 'rabbitmq://queue.monitocorp.com',
    description: 'Email processing queue',
    lastChecked: new Date().toISOString(),
    responseTime: undefined
  },
  {
    id: '5',
    name: 'File Storage',
    type: 'Storage',
    status: 'Online',
    url: 's3://storage.monitocorp.com',
    description: 'Document and media storage',
    lastChecked: new Date().toISOString(),
    responseTime: 180
  }
];

const MOCK_EVENTS: ServiceEvent[] = [
  {
    id: '1',
    serviceId: '1',
    status: 'Online',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    message: 'Service restored after maintenance window'
  },
  {
    id: '2',
    serviceId: '1',
    status: 'Offline',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    message: 'Scheduled maintenance started',
    duration: 60 * 60 * 1000
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random status changes for demo
const getRandomStatus = (): 'Online' | 'Offline' | 'Degraded' => {
  const statuses: ('Online' | 'Offline' | 'Degraded')[] = ['Online', 'Offline', 'Degraded'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const apiService = {
  // Get all services
  async getServices(): Promise<Service[]> {
    await delay(Math.random() * 1000 + 500);
    return [...MOCK_SERVICES];
  },

  // Get service status updates (separate from full service data)
  async getServiceStatuses(): Promise<Partial<Service>[]> {
    await delay(Math.random() * 300 + 200);
    
    // Simulate some services having status changes
    return MOCK_SERVICES.map(service => {
      const shouldUpdate = Math.random() > 0.8; // 20% chance of status change
      return {
        id: service.id,
        status: shouldUpdate ? getRandomStatus() : service.status,
        lastChecked: new Date().toISOString(),
        responseTime: shouldUpdate ? Math.floor(Math.random() * 500) + 50 : service.responseTime
      };
    });
  },

  // Get single service
  async getService(id: string): Promise<Service | null> {
    await delay(Math.random() * 500 + 300);
    const service = MOCK_SERVICES.find(s => s.id === id);
    return service || null;
  },

  // Get service events with pagination
  async getServiceEvents(serviceId: string, page: number = 0): Promise<ServiceEvent[]> {
    await delay(Math.random() * 800 + 400);
    
    // Generate more mock events for demonstration
    const events = Array.from({ length: 20 }, (_, i) => ({
      id: `${serviceId}-event-${page * 20 + i}`,
      serviceId,
      status: getRandomStatus(),
      timestamp: new Date(Date.now() - (page * 20 + i) * 1000 * 60 * 30).toISOString(),
      message: `Service status changed to ${getRandomStatus()}`
    }));
    
    return events;
  },

  // Create service
  async createService(service: Omit<Service, 'id' | 'lastChecked'>): Promise<Service> {
    await delay(Math.random() * 1000 + 500);
    
    if (Math.random() > 0.9) {
      throw new Error('Failed to create service');
    }
    
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      lastChecked: new Date().toISOString()
    };
    
    MOCK_SERVICES.push(newService);
    return newService;
  },

  // Update service
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    await delay(Math.random() * 800 + 400);
    
    if (Math.random() > 0.9) {
      throw new Error('Failed to update service');
    }
    
    const serviceIndex = MOCK_SERVICES.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }
    
    MOCK_SERVICES[serviceIndex] = {
      ...MOCK_SERVICES[serviceIndex],
      ...updates,
      lastChecked: new Date().toISOString()
    };
    
    return MOCK_SERVICES[serviceIndex];
  },

  // Delete service
  async deleteService(id: string): Promise<void> {
    await delay(Math.random() * 600 + 300);
    
    if (Math.random() > 0.9) {
      throw new Error('Failed to delete service');
    }
    
    const serviceIndex = MOCK_SERVICES.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }
    
    MOCK_SERVICES.splice(serviceIndex, 1);
  }
};
