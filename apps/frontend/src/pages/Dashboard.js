import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link2, Plus, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LinkList } from '@/components/links/LinkList';
import { CreateLinkModal } from '@/components/links/CreateLinkModal';
import { useLinkStore } from '@/store/link.store';
import { formatNumber } from '@/lib/utils';
export default function Dashboard() {
    const [page, setPage] = useState(1);
    const links = useLinkStore((s) => s.links);
    const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks ?? 0), 0);
    const pagination = {
        page,
        totalPages: 1,
        total: links.length,
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Your Links" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Create, manage, and track your shortened URLs" })] }), _jsx(CreateLinkModal, {})] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center", children: _jsx(Link2, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", children: formatNumber(links.length) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total Links" })] })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center", children: _jsx(MousePointerClick, { className: "h-5 w-5 text-green-600 dark:text-green-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", children: formatNumber(totalClicks) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total Clicks" })] })] }) })] }), _jsx(LinkList, { links: links, isLoading: false, pagination: pagination, onPageChange: setPage }), links.length === 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-12 text-center space-y-4", children: [_jsx("div", { className: "mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: _jsx(Link2, { className: "h-8 w-8 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: "No links yet" }), _jsx("p", { className: "text-muted-foreground mt-1 max-w-sm mx-auto", children: "Create your first shortened link and start tracking clicks in real time." })] }), _jsx(CreateLinkModal, { trigger: _jsxs(Button, { size: "lg", className: "gap-2", children: [_jsx(Plus, { className: "h-5 w-5" }), "Create your first link"] }) })] }) }))] }));
}
