import { jsx as _jsx } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export function LoadingSpinner({ className, size = 16 }) {
    return (_jsx(Loader2, { className: cn('animate-spin text-muted-foreground', className), size: size }));
}
