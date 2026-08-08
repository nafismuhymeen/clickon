import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { SidebarContent } from './Sidebar';
export function Header() {
    const [open, setOpen] = useState(false);
    return (_jsx("header", { className: "lg:hidden sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsxs("div", { className: "flex items-center h-14 px-4", children: [_jsxs(Sheet, { open: open, onOpenChange: setOpen, children: [_jsx(SheetTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "icon", className: "lg:hidden", children: [_jsx(Menu, { className: "h-5 w-5" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }), _jsxs(SheetContent, { side: "left", className: "w-72 p-0", children: [_jsx(SheetTitle, { className: "sr-only", children: "Navigation menu" }), _jsx(SidebarContent, { onClose: () => setOpen(false) })] })] }), _jsx("div", { className: "flex-1 flex justify-center lg:justify-start", children: _jsx("span", { className: "text-lg font-bold tracking-tight", children: "ClickOn" }) })] }) }));
}
