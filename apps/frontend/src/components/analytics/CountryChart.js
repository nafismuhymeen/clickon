import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function CountryChart({ data }) {
    const top10 = data.slice(0, 10);
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base font-semibold", children: "Top Countries" }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: top10, layout: "vertical", margin: { left: 10 }, children: [_jsx(XAxis, { type: "number", tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }, axisLine: false, tickLine: false }), _jsx(YAxis, { type: "category", dataKey: "country", tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }, axisLine: false, tickLine: false, width: 90 }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    }, labelStyle: { color: 'hsl(var(--foreground))', fontWeight: 600 } }), _jsx(Bar, { dataKey: "count", fill: "hsl(var(--primary))", radius: [0, 4, 4, 0], barSize: 20 })] }) }) }) })] }));
}
