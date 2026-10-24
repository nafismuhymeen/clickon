import { useNavigate } from 'react-router-dom';
import {
  Link2,
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Cpu,
  Sparkles,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Links Shortened & Routed', value: '10M+', description: 'Across worldwide destinations' },
    { label: 'Median Edge Latency', value: '<15ms', description: 'Instant, seamless redirection' },
    { label: 'Platform Availability', value: '99.99%', description: 'Battle-tested enterprise uptime' },
    { label: 'Global Geo Coverage', value: '150+', description: 'Nations and territories serviced' },
  ];

  const pillars = [
    {
      icon: Zap,
      title: 'Sub-Millisecond Redirection',
      description:
        'Every millisecond counts when users click a link. Our global edge routing minimizes hop latency, ensuring users reach their destination immediately without awkward buffering.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Link Intelligence',
      description:
        'Gain granular insights on every click. Track devices, browsers, referring domains, and geographic regions as traffic happens—no waiting for nightly batch reports.',
    },
    {
      icon: ShieldCheck,
      title: 'Anti-Phishing & Malware Guard',
      description:
        'We enforce automated heuristic scans against spam domains and known malicious targets, safeguarding end users and preserving the reputation of your shortened URLs.',
    },
    {
      icon: Code2,
      title: 'Developer-First APIs',
      description:
        'Designed from day one with type-safe APIs, clear documentation, SDKs, and Turborepo monorepo architecture for smooth team workflows and programmatic scale.',
    },
  ];

  const milestones = [
    {
      year: 'Phase 1',
      title: 'High-Performance Core',
      description: 'Engineered a lightweight, non-blocking URL mapping engine with TypeScript and Turborepo.',
    },
    {
      year: 'Phase 2',
      title: 'Granular Analytics Engine',
      description: 'Launched device, referrer, and geographic aggregation with sub-second dashboard visualization.',
    },
    {
      year: 'Phase 3',
      title: 'Team Collaboration & API Suite',
      description: 'Introduced token-based API authentication, batch link creation, and Pro tier feature sets.',
    },
    {
      year: 'Phase 4',
      title: 'Global Edge & Custom Domains',
      description: 'Expanding global points of presence and zero-config branded vanity domains.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <PublicNav activePage="about" />

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-muted/60 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Story, Mission & Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Making every link <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                faster, smarter, and trusted.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ClickOn was born out of frustration with bloated, slow URL shorteners that obscure data and introduce lag. We engineered a modern, developer-centric link platform built for high throughput and transparent analytics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2 shadow-sm">
                Explore Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Talk to Our Team
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Problem / Solution */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
                  The Problem We Solve
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Links are the backbone of the internet, but legacy tools treat them as an afterthought.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Traditional link shorteners clutter users with sluggish redirects, hidden click tracking limits, invasive ad injections, and clunky dashboards that feel like relics from 2010.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  At ClickOn, we rebuilt link infrastructure from the ground up: ultra-clean architecture, transparent click graphs, granular referrers, device breakdown, and seamless API integration that fits neatly into modern developer pipelines.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>No bloated interstitial pages or ad redirects</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Instant real-time click stream analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Open, type-safe API with predictable response formats</span>
                  </div>
                </div>
              </div>

              {/* Graphical Card */}
              <Card className="border-border/60 bg-gradient-to-br from-card via-card/80 to-primary/5 shadow-xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-primary pointer-events-none">
                  <Link2 className="w-48 h-48" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base">Modern Stack Architecture</h4>
                        <p className="text-xs text-muted-foreground">High scalability & type safety</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Turborepo</Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <span className="font-medium">Frontend Framework</span>
                      <span className="text-muted-foreground font-mono text-xs">React 19 + Vite</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <span className="font-medium">Design & UI Tokens</span>
                      <span className="text-muted-foreground font-mono text-xs">Tailwind CSS + shadcn</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <span className="font-medium">Backend & Routing Engine</span>
                      <span className="text-muted-foreground font-mono text-xs">Express + Node + TS</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/80 border">
                      <span className="font-medium">State & Query Management</span>
                      <span className="text-muted-foreground font-mono text-xs">Zustand & TanStack</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 bg-muted/20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
                Engineering Pillars
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Built on four uncompromising foundations
              </h2>
              <p className="text-muted-foreground">
                Everything we build adheres to core principles that protect both the link creator and the end visitor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">{pillar.title}</CardTitle>
                      <CardDescription className="text-sm mt-1 leading-relaxed">
                        {pillar.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap / Evolution */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
                Our Trajectory
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                From monorepo prototype to global platform
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Continuous iteration driving reliability and new features every month.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {milestones.map((m) => (
                <div
                  key={m.year}
                  className="relative p-5 rounded-xl border bg-card/40 backdrop-blur-sm space-y-3"
                >
                  <div className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10 inline-block">
                    {m.year}
                  </div>
                  <h4 className="font-semibold text-base">{m.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 border-t bg-primary/5 dark:bg-primary/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to experience modern link management?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Join thousands of users tracking clicks and optimizing their digital reach with ClickOn.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button size="lg" onClick={() => navigate('/register')} className="gap-2 shadow-md">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
