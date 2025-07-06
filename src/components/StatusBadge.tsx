
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Online' | 'Offline' | 'Degraded';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Online':
        return {
          variant: 'default' as const,
          className: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border-green-300 shadow-sm hover:shadow-md',
          iconColor: 'text-green-600',
          pulseColor: 'bg-green-500'
        };
      case 'Offline':
        return {
          variant: 'destructive' as const,
          className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 border-red-300 shadow-sm hover:shadow-md',
          iconColor: 'text-red-600',
          pulseColor: 'bg-red-500'
        };
      case 'Degraded':
        return {
          variant: 'secondary' as const,
          className: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 border-yellow-300 shadow-sm hover:shadow-md',
          iconColor: 'text-yellow-600',
          pulseColor: 'bg-yellow-500'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600',
          iconColor: 'text-gray-400',
          pulseColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        config.className, 
        "transition-all duration-300 transform hover:scale-105 font-medium px-3 py-1",
        className
      )}
    >
      {showIcon && (
        <div className="relative mr-2">
          <Circle className={cn("w-2 h-2 fill-current", config.iconColor)} />
          {status === 'Online' && (
            <div className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-75",
              config.pulseColor
            )} />
          )}
        </div>
      )}
      <span className="font-semibold">{status}</span>
    </Badge>
  );
};
