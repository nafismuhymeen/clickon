import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MousePointerClick, CalendarDays, Calendar, Globe, Download, } from 'lucide-react';
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
function StatCard({ label, value, icon: Icon, iconColor, }) {
    return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [_jsx("div", { className: `h-10 w-10 rounded-lg ${iconColor} flex items-center justify-center`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", children: formatNumber(value) }), _jsx("p", { className: "text-xs text-muted-foreground", children: label })] })] }) }));
}
export default function Analytics() {
    const { linkId } = useParams();
    const navigate = useNavigate();
    const numericLinkId = Number(linkId) || 1;
    const getAnalytics = useLinkStore((s) => s.getAnalytics);
    const data = getAnalytics(numericLinkId);
    const handleExport = () => {
        toast.success('CSV export requested! (Mock environment: CSV downloaded).');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate('/'), className: "shrink-0", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Analytics" }), _jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: ["Link #", numericLinkId, " performance overview"] })] })] }), _jsx(LockedFeature, { message: "CSV export is a PRO feature", children: _jsxs(Button, { variant: "outline", className: "gap-2", onClick: handleExport, children: [_jsx(Download, { className: "h-4 w-4" }), "Export CSV"] }) })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Total Clicks", value: data.totalClicks, icon: MousePointerClick, iconColor: "bg-primary/10 text-primary" }), _jsx(StatCard, { label: "Clicks Today", value: data.clicksToday, icon: CalendarDays, iconColor: "bg-green-500/10 text-green-600 dark:text-green-400" }), _jsx(StatCard, { label: "This Week", value: data.clicksThisWeek, icon: Calendar, iconColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400" }), _jsx(StatCard, { label: "Countries", value: data.uniqueCountries, icon: Globe, iconColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ClicksChart, { data: data.clicksByDay }) }), _jsx(CountryChart, { data: data.topCountries }), _jsx(DeviceChart, { data: data.topDevices }), _jsx(ReferrerList, { data: data.topReferrers }), _jsx(LiveCounter, { linkId: numericLinkId, initialCount: data.totalClicks })] })] }));
}
