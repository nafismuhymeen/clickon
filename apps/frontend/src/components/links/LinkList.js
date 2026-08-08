import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LinkCard } from './LinkCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
function LinkSkeleton() {
    return (_jsxs("div", { className: "border rounded-xl p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { className: "h-4 w-48" }), _jsx(Skeleton, { className: "h-8 w-8 rounded-md" })] }), _jsx(Skeleton, { className: "h-3 w-72" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { className: "h-5 w-16 rounded-full" }), _jsx(Skeleton, { className: "h-3 w-24" })] })] }));
}
export function LinkList({ links, isLoading, pagination, onPageChange }) {
    if (isLoading) {
        return (_jsx("div", { className: "space-y-3", children: Array.from({ length: 5 }).map((_, i) => (_jsx(LinkSkeleton, {}, i))) }));
    }
    if (links.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "space-y-3", children: [links.map((link) => (_jsx(LinkCard, { link: link }, link.id))), pagination && pagination.totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between pt-4", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Showing page ", pagination.page, " of ", pagination.totalPages, ' ', _jsxs("span", { className: "hidden sm:inline", children: ["(", pagination.total, " total links)"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(pagination.page - 1), disabled: pagination.page <= 1, children: [_jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }), "Previous"] }), _jsx("div", { className: "hidden sm:flex items-center gap-1", children: Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    }
                                    else if (pagination.page <= 3) {
                                        pageNum = i + 1;
                                    }
                                    else if (pagination.page >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    }
                                    else {
                                        pageNum = pagination.page - 2 + i;
                                    }
                                    return (_jsx(Button, { variant: pageNum === pagination.page ? 'default' : 'outline', size: "sm", className: "w-8 h-8 p-0", onClick: () => onPageChange(pageNum), children: pageNum }, pageNum));
                                }) }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(pagination.page + 1), disabled: pagination.page >= pagination.totalPages, children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] })] })] }))] }));
}
