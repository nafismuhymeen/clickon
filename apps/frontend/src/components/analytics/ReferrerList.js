import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
export function ReferrerList({ data }) {
    const maxCount = data.length > 0 ? data[0].count : 0;
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base font-semibold", children: "Top Referrers" }) }), _jsx(CardContent, { children: data.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No referrer data yet" })) : (_jsx("div", { className: "space-y-3", children: data.slice(0, 10).map((item, index) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs text-muted-foreground w-5 text-right font-mono", children: index + 1 }), _jsx(Globe, { className: "h-4 w-4 text-muted-foreground shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium truncate", children: item.referrer || 'Direct' }), _jsx("span", { className: "text-sm text-muted-foreground ml-2", children: formatNumber(item.count) })] }), _jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary/70 rounded-full transition-all duration-500", style: {
                                                width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                                            } }) })] })] }, item.referrer))) })) })] }));
}
