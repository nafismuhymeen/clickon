import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MousePointerClick,
  CalendarDays,
  Calendar,
  Globe,
  Download,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClicksChart } from '@/components/analytics/ClicksChart';
import { CountryChart } from '@/components/analytics/CountryChart';
import { DeviceChart } from '@/components/analytics/DeviceChart';
import { ReferrerList } from '@/components/analytics/ReferrerList';
import { LiveCounter } from '@/components/analytics/LiveCounter';
import { LockedFeature } from '@/components/shared/LockedFeature';
import { useLinkStore } from '@/store/link.store';
import { formatNumber } from '@/lib/utils';

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{formatNumber(value)}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const numericLinkId = Number(linkId);
  const { getAnalytics, fetchAnalytics, exportCSV } = useLinkStore();
  const data = getAnalytics(numericLinkId);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!numericLinkId || isNaN(numericLinkId)) {
      navigate('/dashboard');
      return;
    }
    fetchAnalytics(numericLinkId);
  }, [fetchAnalytics, numericLinkId, navigate]);

  const handleExport = async () => {
    if (isExporting) return; // Prevent multiple clicks
    
    setIsExporting(true);
    try {
      toast.info('CSV export is being generated for PRO accounts...');
      await exportCSV(numericLinkId);
      toast.success('CSV has been generated! Check your email inbox.');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Export failed';
      toast.error(`Export failed: ${errorMsg}`);
      console.error('CSV export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Link #{numericLinkId} performance overview
            </p>
          </div>
        </div>

        <LockedFeature message="CSV export is a PRO feature">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </LockedFeature>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Clicks"
          value={data.totalClicks}
          icon={MousePointerClick}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          label="Clicks Today"
          value={data.clicksToday}
          icon={CalendarDays}
          iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
        />
        <StatCard
          label="This Week"
          value={data.clicksThisWeek}
          icon={Calendar}
          iconColor="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Countries"
          value={data.uniqueCountries}
          icon={Globe}
          iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ClicksChart data={data.clicksByDay} />
        </div>
        <CountryChart data={data.topCountries} />
        <DeviceChart data={data.topDevices} />
        <ReferrerList data={data.topReferrers} />
        <LiveCounter
          linkId={numericLinkId}
          initialCount={data.totalClicks}
        />
      </div>
    </div>
  );
}
