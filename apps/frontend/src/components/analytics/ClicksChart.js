import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function ClicksChart({ data }) {
    const formattedData = useMemo(() => data.map((item) => ({
        ...item,
        label: item.date,
    })), [data]);
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base font-semibold", children: "Clicks Over Time" }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: formattedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }), _jsx(XAxis, { dataKey: "label", className: "text-xs", tick: { fill: 'hsl(var(--muted-foreground))' }, axisLine: { stroke: 'hsl(var(--border))' }, tickLine: false }), _jsx(YAxis, { className: "text-xs", tick: { fill: 'hsl(var(--muted-foreground))' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    }, labelStyle: { color: 'hsl(var(--foreground))', fontWeight: 600 }, itemStyle: { color: 'hsl(var(--primary))' } }), _jsx(Line, { type: "monotone", dataKey: "count", stroke: "hsl(var(--primary))", strokeWidth: 2.5, dot: false, activeDot: {
                                        r: 6,
                                        fill: 'hsl(var(--primary))',
                                        stroke: 'hsl(var(--background))',
                                        strokeWidth: 2,
                                    } })] }) }) }) })] }));
}
