import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription, } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { useLinkStore } from '@/store/link.store';
import { cn } from '@/lib/utils';
const editLinkSchema = z.object({
    originalUrl: z.string().min(1, 'Destination URL is required').url('Please enter a valid URL'),
    isActive: z.boolean(),
    hasExpiration: z.boolean(),
    expiresAt: z.date().optional(),
}).refine((data) => {
    if (data.hasExpiration && !data.expiresAt) {
        return false;
    }
    return true;
}, {
    message: 'Expiration date and time is required when enabled',
    path: ['expiresAt'],
});
export function EditLinkModal({ link }) {
    const [open, setOpen] = useState(false);
    const { updateLink } = useLinkStore();
    const form = useForm({
        resolver: zodResolver(editLinkSchema),
        defaultValues: {
            originalUrl: link.originalUrl,
            isActive: link.isActive,
            hasExpiration: !!link.expiresAt,
            expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
        },
    });
    useEffect(() => {
        form.reset({
            originalUrl: link.originalUrl,
            isActive: link.isActive,
            hasExpiration: !!link.expiresAt,
            expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
        });
    }, [link, form]);
    const hasExpiration = form.watch('hasExpiration');
    const onSubmit = (data) => {
        const expiresAtPayload = data.hasExpiration && data.expiresAt
            ? data.expiresAt.toISOString()
            : undefined;
        updateLink(link.id, {
            originalUrl: data.originalUrl,
            isActive: data.isActive,
            expiresAt: expiresAtPayload,
        });
        toast.success('Link updated successfully!');
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", title: "Edit link", children: _jsx(Pencil, { className: "h-3.5 w-3.5" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit link" }), _jsx(DialogDescription, { children: "Update the destination, status, and expiration details of your short link." })] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsx(FormField, { control: form.control, name: "originalUrl", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Destination URL" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "https://example.com/very/long/url", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "isActive", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-card", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { children: "Link Status" }), _jsx(FormDescription, { children: "Enable or disable redirection for this link." })] }), _jsx(FormControl, { children: _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: field.value, onChange: field.onChange }), _jsx("div", { className: "w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary" })] }) })] })) }), _jsxs("div", { className: "rounded-lg border p-3 shadow-sm space-y-3 bg-card", children: [_jsx(FormField, { control: form.control, name: "hasExpiration", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { children: "Expiration Status" }), _jsx(FormDescription, { children: "Set a date and time when this link should expire." })] }), _jsx(FormControl, { children: _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "sr-only peer", checked: field.value, onChange: (e) => {
                                                                        field.onChange(e);
                                                                        if (!e.target.checked) {
                                                                            form.setValue('expiresAt', undefined);
                                                                        }
                                                                        else {
                                                                            const tomorrow = new Date();
                                                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                                                            tomorrow.setHours(12, 0, 0, 0);
                                                                            form.setValue('expiresAt', tomorrow);
                                                                        }
                                                                    } }), _jsx("div", { className: "w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary" })] }) })] })) }), _jsx(FormField, { control: form.control, name: "expiresAt", render: ({ field }) => (_jsxs(FormItem, { className: cn("flex flex-col space-y-2 transition-opacity duration-200", !hasExpiration && "opacity-50"), children: [_jsx(FormLabel, { children: "Expiration Date & Time" }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", disabled: !hasExpiration, className: cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground"), children: [field.value ? (format(field.value, "PPP p")) : (_jsx("span", { children: "Pick a date and time" })), _jsx(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })] }) }) }), _jsxs(PopoverContent, { className: "w-auto p-0", align: "start", children: [_jsx(Calendar, { mode: "single", selected: field.value, onSelect: (date) => {
                                                                            if (!date)
                                                                                return;
                                                                            const newDate = field.value ? new Date(field.value) : new Date();
                                                                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                                                            field.onChange(newDate);
                                                                        }, disabled: (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) }), _jsxs("div", { className: "p-3 border-t border-border flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Time" })] }), _jsx("input", { type: "time", disabled: !field.value, value: field.value ? format(field.value, "HH:mm") : "12:00", onChange: (e) => {
                                                                                    const [hours, minutes] = e.target.value.split(":").map(Number);
                                                                                    const newDate = field.value ? new Date(field.value) : new Date();
                                                                                    newDate.setHours(hours || 0, minutes || 0, 0, 0);
                                                                                    field.onChange(newDate);
                                                                                }, className: "w-28 px-2 py-1 text-sm bg-transparent border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground" })] })] })] }), _jsx(FormMessage, {})] })) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", children: "Save changes" })] })] }) })] })] }));
}
