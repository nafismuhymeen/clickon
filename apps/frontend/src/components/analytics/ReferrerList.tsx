import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

interface ReferrerListProps {
  data: { referrer: string; count: number }[];
}

export function ReferrerList({ data }: ReferrerListProps) {
  const maxCount = data.length > 0 ? data[0].count : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Top Referrers</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No referrer data yet
          </p>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 10).map((item, index) => (
              <div key={item.referrer} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-5 text-right font-mono">
                  {index + 1}
                </span>
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {item.referrer || 'Direct'}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {formatNumber(item.count)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all duration-500"
                      style={{
                        width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
