import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

interface LiveCounterProps {
  linkId: number;
  initialCount: number;
}

export function LiveCounter({ initialCount }: LiveCounterProps) {
  const [count, setCount] = useState(() => initialCount);
  const [flash, setFlash] = useState(false);

  // Simulate live incoming clicks for demo UI
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="relative">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-ping" />
          </div>
          Live Counter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p
            className={`text-5xl font-bold tracking-tight transition-all duration-300 ${
              flash
                ? 'text-green-500 scale-110'
                : 'text-foreground scale-100'
            }`}
          >
            {formatNumber(count)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Total clicks</p>
        </div>

        {/* Decorative animated gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-primary" />
      </CardContent>
    </Card>
  );
}
