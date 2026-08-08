import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription, } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { LockedFeature } from '@/components/shared/LockedFeature';
import { useLinkStore } from '@/store/link.store';
import { cn } from '@/lib/utils';
const createLinkSchema = z.object({
    originalUrl: z.string().min(1, 'Destination URL is required').url('Please enter a valid URL'),
    customSlug: z.string().optional(),
    expiresAt: z.date().optional(),
});
export function CreateLinkModal({ trigger }) {
    const [open, setOpen] = useState(false);
    const { addLink } = useLinkStore();
    const form = useForm({
        resolver: zodResolver(createLinkSchema),
        defaultValues: {
            originalUrl: '',
            customSlug: '',
        },
    });
    const onSubmit = (data) => {
        addLink({
            originalUrl: data.originalUrl,
            customSlug: data.customSlug || undefined,
        });
        toast.success('Link created successfully!');
        form.reset();
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: trigger || (_jsxs(Button, { className: "gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Link"] })) }), _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create a new link" }), _jsx(DialogDescription, { children: "Shorten a long URL and share it with the world" })] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsx(FormField, { control: form.control, name: "originalUrl", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Destination URL" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "https://example.com/very/long/url", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(LockedFeature, { message: "Custom slugs are a PRO feature", children: _jsx(FormField, { control: form.control, name: "customSlug", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Custom slug" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "my-brand", ...field }) }), _jsx(FormDescription, { children: "3-50 characters, letters, numbers, and hyphens only" }), _jsx(FormMessage, {})] })) }) }), _jsx(FormField, { control: form.control, name: "expiresAt", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-col", children: [_jsx(FormLabel, { children: "Expiry date (optional)" }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", className: cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground'), children: [field.value ? (format(field.value, 'PPP')) : (_jsx("span", { children: "Pick a date" })), _jsx(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })] }) }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx(Calendar, { mode: "single", selected: field.value, onSelect: field.onChange, disabled: (date) => date < new Date() }) })] }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", children: "Create link" })] })] }) })] })] }));
}
