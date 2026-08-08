import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Key, Users, Link2, Lock, LogOut, BookOpen, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/store/auth.store';
const navItems = [
    {
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        label: 'Project Docs',
        href: '/docs',
        icon: BookOpen,
    },
];
const futureItems = [
    { label: 'Settings', icon: Settings },
    { label: 'API Keys', icon: Key },
    { label: 'Team', icon: Users },
];
export function SidebarContent({ onClose }) {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "p-6 pb-4", children: _jsxs(Link, { to: "/", onClick: onClose, className: "flex items-center gap-2.5 group", children: [_jsx("div", { className: "h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow", children: _jsx(Link2, { className: "h-5 w-5 text-primary-foreground" }) }), _jsx("span", { className: "text-xl font-bold tracking-tight", children: "ClickOn" })] }) }), _jsx(Separator, {}), _jsxs("nav", { className: "flex-1 p-3 space-y-1", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2", children: "Menu" }), navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (_jsxs(Link, { to: item.href, onClick: onClose, className: cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200', isActive
                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'), children: [_jsx(item.icon, { className: cn('h-4.5 w-4.5', isActive && 'text-primary') }), item.label] }, item.href));
                    }), _jsx(Separator, { className: "my-3" }), _jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2", children: "Coming Soon" }), futureItems.map((item) => (_jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed", children: [_jsx(item.icon, { className: "h-4.5 w-4.5" }), _jsx("span", { className: "flex-1", children: item.label }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Lock, { className: "h-3 w-3" }), _jsx(Badge, { variant: "outline", className: "text-[9px] px-1 py-0 border-muted-foreground/20 text-muted-foreground/50", children: "Soon" })] })] }, item.label)))] }), _jsx(Separator, {}), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx("span", { className: "text-sm font-semibold text-primary", children: user?.email?.charAt(0).toUpperCase() || 'U' }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium truncate", children: user?.email || 'user@clickon.io' }), _jsx(Badge, { variant: "secondary", className: cn('text-[10px] px-1.5 py-0 font-bold', user?.role === 'PRO'
                                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                            : 'bg-muted text-muted-foreground'), children: user?.role || 'FREE' })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ThemeToggle, {}), _jsxs(Button, { variant: "ghost", size: "sm", className: "flex-1 justify-start text-muted-foreground hover:text-destructive", onClick: () => {
                                    logout();
                                    onClose?.();
                                }, children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Sign out"] })] })] })] }));
}
export function Sidebar() {
    return (_jsx("aside", { className: "hidden lg:flex flex-col w-64 border-r bg-card/50 backdrop-blur min-h-screen fixed left-0 top-0 z-30", children: _jsx(SidebarContent, {}) }));
}
