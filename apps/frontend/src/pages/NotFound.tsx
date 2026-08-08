import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-muted flex items-center justify-center">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <Button asChild>
          <Link to="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
