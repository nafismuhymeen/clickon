import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function NotFound() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-6", children: [_jsx("div", { className: "mx-auto h-20 w-20 rounded-2xl bg-muted flex items-center justify-center", children: _jsx(FileQuestion, { className: "h-10 w-10 text-muted-foreground" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight", children: "404" }), _jsx("p", { className: "text-muted-foreground mt-2 text-lg", children: "The page you're looking for doesn't exist." })] }), _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/", children: "Go to Dashboard" }) })] }) }));
}
