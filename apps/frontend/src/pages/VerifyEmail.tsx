import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi, getApiErrorMessage } from '@/lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const verifiedRef = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() => (token ? 'loading' : 'error'));
  const [message, setMessage] = useState<string>(() =>
    token ? 'Verifying your email address...' : 'Missing verification token. Please check the link from your email.'
  );

  useEffect(() => {
    if (!token) return;
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getApiErrorMessage(err, 'Verification link is invalid or has expired.'));
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-indigo-950/20 p-4">
      <Card className="w-full max-w-md relative shadow-xl shadow-black/5 dark:shadow-black/20 border-border/50 text-center">
        <CardHeader className="space-y-4 pb-2">
          {status === 'loading' && (
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          )}
          {status === 'error' && (
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <XCircle className="h-8 w-8" />
            </div>
          )}

          <div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription className="text-base mt-2">{message}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {status === 'success' && (
            <Button className="w-full gap-2 font-semibold" onClick={() => navigate('/login')}>
              Sign In to Your Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/login')}>
                Go to Sign In
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
