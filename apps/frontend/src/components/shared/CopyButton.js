import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function CopyButton({ text, className, variant = 'ghost', size = 'icon', }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    return (_jsxs(Button, { variant: variant, size: size, className: cn('h-8 w-8', className), onClick: handleCopy, children: [copied ? (_jsx(Check, { className: "h-3.5 w-3.5 text-green-500" })) : (_jsx(Copy, { className: "h-3.5 w-3.5" })), _jsx("span", { className: "sr-only", children: "Copy" })] }));
}
