import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CopyButton } from '@/components/shared/CopyButton';
import { LinkActions } from './LinkActions';
import { formatDate, formatNumber, truncateUrl } from '@/lib/utils';
import type { Link } from '@/types';

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Link info */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Short URL */}
          <div className="flex items-center gap-2">
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline truncate"
            >
              {link.shortUrl}
            </a>
            <CopyButton text={link.shortUrl} />
          </div>

          {/* Original URL */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground truncate max-w-md cursor-default">
                  {truncateUrl(link.originalUrl)}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm">
                <p className="break-all text-xs">{link.originalUrl}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant={link.isActive ? 'default' : 'secondary'}
              className={
                link.isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100'
                  : 'bg-muted text-muted-foreground hover:bg-muted'
              }
            >
              {link.isActive ? 'Active' : 'Inactive'}
            </Badge>

            <span className="text-xs text-muted-foreground">
              {formatDate(link.createdAt)}
            </span>

            {link.expiresAt && (
              <span className="text-xs text-muted-foreground">
                Expires {formatDate(link.expiresAt)}
              </span>
            )}
          </div>
        </div>

        {/* Click count + actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center px-3">
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(link.totalClicks ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">clicks</p>
          </div>

          <LinkActions link={link} />
        </div>
      </div>
    </Card>
  );
}
