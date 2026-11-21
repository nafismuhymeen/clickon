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
import { getApiErrorMessage } from '@/lib/api';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['FREE', 'PRO']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'PRO',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const res = await register({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setRegisteredEmail(res.email);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-indigo-950/20 p-4">
        <Card className="w-full max-w-md relative shadow-xl shadow-black/5 dark:shadow-black/20 border-border/50 text-center">
          <CardHeader className="space-y-4 pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
              <Link2 className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
              <CardDescription className="text-base mt-2">
                We sent a verification link to <span className="font-semibold text-foreground">{registeredEmail}</span>.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please click the link inside the email to verify your address. Once verified, you can immediately sign in to your dashboard.
            </p>
            <div className="space-y-3">
              <Button
                variant="default"
                className="w-full font-semibold"
                onClick={() => navigate('/login')}
              >
                Go to Sign In
              </Button>
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setRegisteredEmail(null)}
              >
                Entered wrong email? Register again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-indigo-950/20 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative shadow-xl shadow-black/5 dark:shadow-black/20 border-border/50">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Link2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription className="text-base mt-1">
              Start shortening links with ClickOn
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">FREE</SelectItem>
                        <SelectItem value="PRO">PRO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <div className="w-1 h-1 rounded-full bg-border" />
            <Link to="/docs" className="text-primary font-medium hover:underline">
              Read Project Documentation
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
