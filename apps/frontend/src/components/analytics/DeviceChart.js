import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const COLORS = [
    '#3b82f6',
    '#10b981',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
];
export function DeviceChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-base font-semibold", children: "Device Breakdown" }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, paddingAngle: 4, dataKey: "count", nameKey: "device", strokeWidth: 0, children: data.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    }, formatter: (value, name) => [
                                        `${value} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                                        String(name).charAt(0).toUpperCase() + String(name).slice(1),
                                    ] }), _jsx(Legend, { verticalAlign: "bottom", formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1) })] }) }) }) })] }));
}
