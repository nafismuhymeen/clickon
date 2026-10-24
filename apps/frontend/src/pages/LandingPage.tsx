import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Globe2,
  QrCode,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MousePointerClick,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useLinkStore } from '@/store/link.store';
import { toast } from 'sonner';

export default function LandingPage() {
  const navigate = useNavigate();
  const addLink = useLinkStore((s) => s.addLink);

  const [inputUrl, setInputUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [createdLink, setCreatedLink] = useState<{ shortUrl: string; id: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'js' | 'python'>('js');

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      let formattedUrl = inputUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const newLink = addLink({
        originalUrl: formattedUrl,
        customSlug: customAlias.trim() || undefined,
      });

      setCreatedLink({
        shortUrl: newLink.shortUrl,
        id: newLink.id,
      });

      toast.success('Link shortened successfully!');
    } catch {
      toast.error('Failed to shorten link');
    }
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Background ambient lighting glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-200">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">ClickOn</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#hero" className="hover:text-foreground transition-colors">
              Shortener
            </a>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2 shadow-sm"
            >
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-muted/60 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen URL Management & Real-Time Analytics</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
              Shorten, Share & Track <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Every Link in Real-Time
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
              Transform messy URLs into clean, high-performing branded links. Gain granular 
              geographic insights, monitor click conversions, and automate via developer REST APIs.
            </p>

            {/* Interactive Shortener Widget */}
            <div className="max-w-2xl mx-auto mt-8">
              <Card className="border shadow-xl bg-card/80 backdrop-blur-lg">
                <CardContent className="p-6">
                  <form onSubmit={handleShorten} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="Paste long URL (e.g. https://example.com/very-long-path)"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          className="h-12 text-sm pr-10"
                        />
                        {inputUrl && (
                          <button
                            type="button"
                            onClick={() => setInputUrl('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <Button type="submit" size="lg" className="h-12 px-6 gap-2 font-semibold shadow-md">
                        <Zap className="h-4 w-4" />
                        Shorten
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Custom alias (optional):</span>
                      <div className="relative flex-1 max-w-xs">
                        <Input
                          type="text"
                          placeholder="e.g. my-campaign"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Result Box */}
                  {createdLink && (
                    <div className="mt-5 p-4 rounded-xl border bg-primary/5 dark:bg-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs text-muted-foreground font-medium">Short Link Ready:</p>
                          <a
                            href={createdLink.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-primary hover:underline truncate block"
                          >
                            {createdLink.shortUrl}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="gap-1.5 text-xs h-9"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => navigate(`/analytics/${createdLink.id}`)}
                          className="gap-1.5 text-xs h-9"
                        >
                          Analytics
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Feature pills below hero widget */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>&lt;5ms Global Edge Latency</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Encrypted & Safe Redirects</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <QrCode className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Instant QR Code Generation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="stats" className="py-16 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                Platform Statistics
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Trusted by Creators & Developers Worldwide</h2>
              <p className="text-sm text-muted-foreground">
                Our infrastructure handles massive redirection volumes with enterprise-grade reliability and real-time accuracy.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="border hover:border-primary/50 transition-colors shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Link2 className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    10M+
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Links Shortened
                  </p>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary/50 transition-colors shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <MousePointerClick className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    500M+
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Total Clicks Tracked
                  </p>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary/50 transition-colors shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    99.99%
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Uptime SLA Guarantee
                  </p>
                </CardContent>
              </Card>

              <Card className="border hover:border-primary/50 transition-colors shadow-sm text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="h-10 w-10 mx-auto rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    &lt;5ms
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Avg Edge Latency
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services & Core Features Section */}
        <section id="services" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                Services Provided
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything You Need for Modern Link Management
              </h2>
              <p className="text-muted-foreground text-base">
                ClickOn provides an end-to-end suite for individuals, teams, and developers 
                looking to control, secure, and analyze their digital web traffic.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Lightning-Fast Shortening</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create clean, memorable links instantly with custom slugs. Powered by edge nodes for zero-delay redirections.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Real-Time Analytics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor click activity, unique visitors, geographic maps, device breakdowns, and top referring channels live.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Instant Vector QR Codes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generate high-resolution SVG/PNG QR codes for print media, product packaging, events, and offline marketing campaigns.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Security & Expiry Controls</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Protect confidential links with custom passwords, set expiration dates, or pause link availability with a single click.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Developer REST API</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Integrate link generation and automated stats fetching directly into your application workflows with webhooks and SDKs.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="border bg-card/60 backdrop-blur hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Globe2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Global Edge Distribution</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ensure high availability with redundant routing across North America, Europe, and Asia Pacific datacenters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Product Interactive Preview Section */}
        <section id="preview" className="py-20 bg-muted/40 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                  Interactive Dashboard Preview
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Comprehensive Analytics at a Single Glance
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  ClickOn automatically categorizes every visit so you can understand your audience better. 
                  View click distributions by day of the week, top referrers like X/Twitter or LinkedIn, and user devices.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">Automatic bot filtering & spam prevention</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">Detailed geographical visitor heatmaps</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">One-click data export to CSV and JSON</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/dashboard')} className="gap-2 shadow-sm">
                    Open Interactive Dashboard
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Simulated Analytics Card */}
              <Card className="border shadow-2xl bg-card overflow-hidden">
                <div className="bg-muted/70 px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="text-xs font-mono text-muted-foreground ml-2">clickon.io/analytics/tech-launch-2026</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">LIVE DEMO</Badge>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Active Campaign</p>
                      <h4 className="text-lg font-bold">tech-launch-2026</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-primary">1,420</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+24.5% this week</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <p className="text-[11px] text-muted-foreground">Top Country</p>
                      <p className="text-sm font-bold mt-0.5">United States</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <p className="text-[11px] text-muted-foreground">Top Source</p>
                      <p className="text-sm font-bold mt-0.5">Twitter / X</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <p className="text-[11px] text-muted-foreground">Top Device</p>
                      <p className="text-sm font-bold mt-0.5">Chrome Desktop</p>
                    </div>
                  </div>

                  {/* Simulated Chart Bars */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-muted-foreground">Daily Click Distribution</p>
                    <div className="h-24 flex items-end justify-between gap-2 pt-4">
                      {[40, 60, 80, 100, 90, 45, 50].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div
                            className="w-full bg-primary/20 group-hover:bg-primary rounded-t transition-all duration-300"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Developer API & Code Snippet Section */}
        <section id="developer" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                  Built for Developers
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Seamless REST API Integration
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Programmatically generate shortened URLs, create custom aliases, and retrieve analytics 
                  data with clean, standard REST endpoints.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Code2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Standard JSON Payload</h4>
                      <p className="text-xs text-muted-foreground">Simple body structure with full support for optional parameters.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Real-Time Webhooks</h4>
                      <p className="text-xs text-muted-foreground">Receive instant notifications whenever links pass click thresholds.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/docs')}
                    className="gap-2"
                  >
                    View Full API Documentation
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Code Snippet Card */}
              <Card className="border shadow-xl bg-slate-950 text-slate-100 dark:bg-card">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCodeTab('js')}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                        activeCodeTab === 'js'
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      JavaScript
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('curl')}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                        activeCodeTab === 'curl'
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('python')}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                        activeCodeTab === 'python'
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Python
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">POST /api/v1/links</span>
                </div>

                <CardContent className="p-4 font-mono text-xs overflow-x-auto leading-relaxed text-slate-300">
                  {activeCodeTab === 'js' && (
                    <pre>
                      <code>{`const response = await fetch('http://localhost:5000/api/v1/links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    originalUrl: 'https://github.com/nafis/clickon-monorepo',
    customSlug: 'tech-launch-2026'
  })
});

const data = await response.json();
console.log('Short URL:', data.shortUrl);`}</code>
                    </pre>
                  )}

                  {activeCodeTab === 'curl' && (
                    <pre>
                      <code>{`curl -X POST http://localhost:5000/api/v1/links \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "originalUrl": "https://github.com/nafis/clickon-monorepo",
    "customSlug": "tech-launch-2026"
  }'`}</code>
                    </pre>
                  )}

                  {activeCodeTab === 'python' && (
                    <pre>
                      <code>{`import requests

url = "http://localhost:5000/api/v1/links"
payload = {
    "originalUrl": "https://github.com/nafis/clickon-monorepo",
    "customSlug": "tech-launch-2026"
}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.post(url, json=payload, headers=headers)
print("Short URL:", response.json().get("shortUrl"))`}</code>
                    </pre>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-16 border-t bg-primary/5 dark:bg-primary/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Supercharge Your Web Links?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Join thousands of creators and developers using ClickOn for reliable redirection, analytics, and custom branding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button size="lg" onClick={() => navigate('/register')} className="gap-2 shadow-md">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
