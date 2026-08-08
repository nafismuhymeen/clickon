import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { SidebarContent } from './Sidebar';
import { Header } from './Header';
export function AppLayout() {
    return (_jsxs("div", { className: "min-h-screen flex bg-background", children: [_jsx("aside", { className: "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card", children: _jsx(SidebarContent, {}) }), _jsxs("div", { className: "flex-1 lg:pl-64", children: [_jsx(Header, {}), _jsx("main", { className: "p-4 md:p-6 lg:p-8", children: _jsx("div", { className: "max-w-6xl mx-auto", children: _jsx(Outlet, {}) }) })] })] }));
}
