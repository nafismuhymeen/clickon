import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  Zap,
  TrendingUp,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';

export default function Docs() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-indigo-950/20 text-foreground relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Navigation / Header */}
        <div className="flex justify-between items-center pb-6 border-b border-border/50">
          <Link to={isAuthenticated ? '/' : '/login'}>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to {isAuthenticated ? 'Dashboard' : 'Sign in'}
            </Button>
          </Link>
          <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
            Monorepo Architecture Docs
          </Badge>
        </div>

        {/* Project Intro */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            ClickOn Monorepo
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            A high-performance pnpm + Turborepo workspace featuring shared tooling, React + Vite frontend, Express + TypeScript backend, and shadcn UI.
          </p>
        </div>

        {/* 1. How It Works Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Monorepo Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary font-bold">01.</span> Turborepo Pipelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Task execution for `build`, `lint`, and `dev` is managed by Turborepo, leveraging smart caching across all workspace packages in `apps/` and `tooling/`.
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary font-bold">02.</span> Shared Tooling
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Configurations for TypeScript (`@clickon/tsconfig`) and ESLint (`@clickon/eslint-config`) are centralized in `tooling/`, ensuring strict code standards.
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary font-bold">03.</span> Modern Frontend UI
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                React 19 + Vite app equipped with 17 shadcn UI components, Tailwind CSS design system tokens, Recharts analytics, and Zustand mock state.
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary font-bold">04.</span> Express TypeScript Backend
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                TypeScript Node service using Express, CORS, and `tsx` hot-reloading server watchers in `apps/backend`.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Features Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Key Features</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'pnpm Workspaces & Turborepo',
                desc: 'Integrated monorepo workflow with pnpm package manager and Turbo caching.',
              },
              {
                title: 'Unprotected UI Preview Mode',
                desc: 'All dashboard views, link cards, creation modals, and analytics charts are directly accessible for UI demonstration.',
              },
              {
                title: 'Interactive Mock Link Store',
                desc: 'Full local state interaction: create new links, toggle active status, edit destination URLs, and view detailed analytics.',
              },
              {
                title: 'Visualized Analytics (Recharts)',
                desc: 'Charts for clicks over time, country distribution, device breakdowns, and top referrers.',
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-4 border border-border/40 rounded-xl bg-card/40 backdrop-blur-sm items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Tech Stack Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Code2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Technology Stack</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Frontend Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'Vite', 'TypeScript', 'TailwindCSS', 'Shadcn UI', 'Zustand', 'Recharts', 'Sonner'].map((t) => (
                    <Badge key={t} variant="secondary" className="bg-slate-100 dark:bg-slate-800/50">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" /> Backend & Monorepo Tooling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {['NodeJS', 'TypeScript', 'Express', 'pnpm', 'Turborepo', 'ESLint Flat Config', 'Prettier'].map((t) => (
                    <Badge key={t} variant="secondary" className="bg-slate-100 dark:bg-slate-800/50">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-border/50 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ClickOn Monorepo Architecture.</p>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
