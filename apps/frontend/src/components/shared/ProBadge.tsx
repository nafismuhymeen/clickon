import { Badge } from '@/components/ui/badge';

export function ProBadge() {
  return (
    <Badge
      variant="secondary"
      className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0"
    >
      PRO
    </Badge>
  );
}
