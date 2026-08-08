import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '@/store/auth.store';
import { ProBadge } from './ProBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip';
export function LockedFeature({ children, message = 'Upgrade to PRO to unlock this feature', }) {
    const userRole = useAuthStore((s) => s.user?.role);
    if (userRole === 'PRO') {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "opacity-50 pointer-events-none select-none", children: children }), _jsx("div", { className: "absolute top-1 right-1", children: _jsx(ProBadge, {}) })] }) }), _jsx(TooltipContent, { children: _jsx("p", { children: message }) })] }) }));
}
