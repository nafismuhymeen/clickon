import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
const registerSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['FREE', 'PRO']),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            role: 'PRO',
        },
    });
    const onSubmit = (data) => {
        setIsSubmitting(true);
        setTimeout(() => {
            login({ id: Date.now(), email: data.email, role: data.role });
            toast.success('Account created successfully! Welcome to ClickOn.');
            setIsSubmitting(false);
            navigate('/');
        }, 500);
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-indigo-950/20 p-4", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" }), _jsx("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" })] }), _jsxs(Card, { className: "w-full max-w-md relative shadow-xl shadow-black/5 dark:shadow-black/20 border-border/50", children: [_jsxs(CardHeader, { className: "text-center space-y-4 pb-2", children: [_jsx("div", { className: "mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25", children: _jsx(Link2, { className: "h-6 w-6 text-primary-foreground" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-2xl font-bold", children: "Create your account" }), _jsx(CardDescription, { className: "text-base mt-1", children: "Start shortening links with ClickOn" })] })] }), _jsxs(CardContent, { className: "pt-4", children: [_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(FormControl, { children: _jsx(Input, { type: "email", placeholder: "you@example.com", autoComplete: "email", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "role", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Role" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a role" }) }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "FREE", children: "FREE" }), _jsx(SelectItem, { value: "PRO", children: "PRO" })] })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "password", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Password" }), _jsx(FormControl, { children: _jsx(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "confirmPassword", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Confirm Password" }), _jsx(FormControl, { children: _jsx(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "new-password", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: [isSubmitting && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Create account"] })] }) }), _jsxs("div", { className: "mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground", children: [_jsxs("p", { children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-primary font-medium hover:underline", children: "Sign in" })] }), _jsx("div", { className: "w-1 h-1 rounded-full bg-border" }), _jsx(Link, { to: "/docs", className: "text-primary font-medium hover:underline", children: "Read Project Documentation" })] })] })] })] }));
}
