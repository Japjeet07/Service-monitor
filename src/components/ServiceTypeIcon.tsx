
import { Database, Globe, Layers, HardDrive, Archive } from 'lucide-react';

interface ServiceTypeIconProps {
  type: 'API' | 'Database' | 'Queue' | 'Cache' | 'Storage';
  className?: string;
}

export const ServiceTypeIcon = ({ type, className = "w-4 h-4" }: ServiceTypeIconProps) => {
  switch (type) {
    case 'API':
      return <Globe className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Queue':
      return <Layers className={className} />;
    case 'Cache':
      return <HardDrive className={className} />;
    case 'Storage':
      return <Archive className={className} />;
    default:
      return <Globe className={className} />;
  }
};
