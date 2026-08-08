import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { ProBadge } from './ProBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LockedFeatureProps {
  children: ReactNode;
  message?: string;
}

export function LockedFeature({
  children,
  message = 'Upgrade to PRO to unlock this feature',
}: LockedFeatureProps) {
  const userRole = useAuthStore((s) => s.user?.role);

  if (userRole === 'PRO') {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <div className="opacity-50 pointer-events-none select-none">
              {children}
            </div>
            <div className="absolute top-1 right-1">
              <ProBadge />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
