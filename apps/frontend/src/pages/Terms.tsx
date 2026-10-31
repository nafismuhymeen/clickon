import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Printer,
  ChevronRight,
  ExternalLink,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'services', title: '2. Description of Services & Eligibility' },
    { id: 'accounts', title: '3. User Accounts & Security' },
    { id: 'acceptable-use', title: '4. Acceptable Use & Zero-Tolerance Abuse' },
    { id: 'custom-slugs', title: '5. Custom Slugs & Vanity URLs' },
    { id: 'api-usage', title: '6. API Access & Rate Limiting' },
    { id: 'privacy', title: '7. Analytics & Data Privacy' },
    { id: 'intellectual-property', title: '8. Intellectual Property Rights' },
    { id: 'disclaimer', title: '9. Disclaimer of Warranties' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'termination', title: '11. Suspension & Termination' },
    { id: 'governing-law', title: '12. Governing Law & Dispute Resolution' },
    { id: 'contact-legal', title: '13. Legal Inquiries & Notices' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <PublicNav activePage="terms" />

      <main className="flex-1 z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b pb-8 mb-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
                  Legal Documentation
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  Version 2026.2 • Effective Date: October 2026
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  Print Terms
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    Legal Help
                  </Button>
                </Link>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">
              These terms govern your access to and use of ClickOn's websites, APIs, short-link redirection services, and real-time analytics suite. By creating links or utilizing our platform, you agree to be bound by these provisions.
            </p>
          </div>

          {/* Key Compliance Notice Callout */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Strict Zero Tolerance for Abuse
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Short links targeting phishing pages, malware downloads, scam schemes, or unauthorized adult content are subject to automated instantaneous deletion and IP blocking.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10">
              <CardContent className="p-4 flex items-start gap-3">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    Commercial & Free Fair Use
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Free accounts receive unlimited standard redirections. High-frequency automated scripts and programmatic API integrations must comply with rate guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Layout: Sidebar TOC + Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Table of Contents Sticky Sidebar (4 cols) */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 p-5 rounded-2xl border bg-card/60 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Table of Contents</span>
                </div>

                <nav className="space-y-1 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-between ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      <ChevronRight className={`h-3 w-3 shrink-0 ${activeSection === section.id ? 'opacity-100' : 'opacity-30'}`} />
                    </button>
                  ))}
                </nav>

                <div className="pt-2 border-t">
                  <Link
                    to="/contact"
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Need clarification on a clause? Contact Legal
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Terms Articles (8 cols) */}
            <div className="lg:col-span-8 space-y-12 leading-relaxed text-sm">
              {/* Section 1 */}
              <section id="acceptance" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">01.</span> Acceptance of Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing, browsing, registering with, or utilizing any services provided by ClickOn ("ClickOn", "we", "our", or "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must discontinue the use of our services immediately.
                </p>
                <p className="text-muted-foreground">
                  These Terms apply to all registered members, anonymous visitors, API integrators, and software applications interacting with ClickOn infrastructure.
                </p>
              </section>

              {/* Section 2 */}
              <section id="services" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">02.</span> Description of Services & Eligibility
                </h2>
                <p className="text-muted-foreground">
                  ClickOn provides an enterprise-grade URL shortening engine, global edge HTTP 301/302 redirection, real-time analytics aggregation (including country, device, browser, and referring origin metrics), and programmatic REST APIs.
                </p>
                <p className="text-muted-foreground">
                  You must be at least 13 years old (or 16 in the European Economic Area) to use ClickOn. By using ClickOn, you warrant that you possess full legal capacity to enter into a binding contract in your jurisdiction.
                </p>
              </section>

              {/* Section 3 */}
              <section id="accounts" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">03.</span> User Accounts & Security
                </h2>
                <p className="text-muted-foreground">
                  When you register an account, you must provide accurate, complete, and current information. You are solely responsible for maintaining the confidentiality of your login credentials, including passwords and API authorization tokens.
                </p>
                <p className="text-muted-foreground">
                  You agree to immediately notify ClickOn of any unauthorized use or potential breach of your account. ClickOn is not liable for any loss or damages arising from compromised credentials under your control.
                </p>
              </section>

              {/* Section 4 */}
              <section id="acceptable-use" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">04.</span> Acceptable Use & Zero-Tolerance Abuse
                </h2>
                <p className="text-muted-foreground">
                  ClickOn is dedicated to maintaining a safe, trustworthy web ecosystem. You agree NOT to use ClickOn services to shorten, redirect, forward, or facilitate traffic to:
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground pl-2">
                  <li>Phishing pages, credential-harvesting forms, or deceptive identity spoofing.</li>
                  <li>Distribution of trojans, viruses, ransomware, spyware, or malicious payloads.</li>
                  <li>Unsolicited commercial electronic communications (spam email, SMS blasts, forum scraping).</li>
                  <li>Illegal gambling, unlicensed narcotics sales, or terrorism-related material.</li>
                  <li>Child sexual abuse material (CSAM) or any exploitation of minors (subject to instant reporting to NCMEC and international law enforcement).</li>
                  <li>Infringing copyright materials, torrent trackers, or unauthorized intellectual property distributions.</li>
                </ul>
                <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Automated Link Disablement
                  </div>
                  <p className="text-muted-foreground">
                    Links reported or detected violating our safety standards will be deactivated without prior notice, and offending accounts will be terminated permanently.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="custom-slugs" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">05.</span> Custom Slugs & Vanity URLs
                </h2>
                <p className="text-muted-foreground">
                  ClickOn allows users to assign custom aliases ("slugs") to their shortened URLs. Custom slugs are allocated on a first-come, first-served basis. However, you may not claim slugs that infringe upon registered trademarks, brand names, or misleading entity names with intent to confuse or squat.
                </p>
                <p className="text-muted-foreground">
                  ClickOn reserves the right to reclaim, reassign, or revoke any custom slug upon receipt of a valid trademark claim or evidence of malicious impersonation.
                </p>
              </section>

              {/* Section 6 */}
              <section id="api-usage" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">06.</span> API Access & Rate Limiting
                </h2>
                <p className="text-muted-foreground">
                  Developers utilizing our REST APIs must operate within published rate limits (e.g., standard accounts are allocated 100 link creations per hour). Attempting to circumvent rate limit protections via rotating proxies, botnets, or synthetic identities constitutes a violation of these Terms.
                </p>
                <p className="text-muted-foreground">
                  For elevated throughput, custom burst limits, or dedicated webhooks, contact our team to obtain an Enterprise tier key.
                </p>
              </section>

              {/* Section 7 */}
              <section id="privacy" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">07.</span> Analytics & Data Privacy
                </h2>
                <p className="text-muted-foreground">
                  ClickOn records anonymous click event telemetry (e.g. browser user-agent family, rough geolocation derived from IP, referrer header, and timestamp) to provide analytics to link creators. We do not sell personally identifiable visitor data to third-party ad brokers.
                </p>
                <p className="text-muted-foreground">
                  Users in jurisdictions covered by GDPR, CCPA, or equivalent regulations may exercise standard data retrieval and deletion rights by contacting privacy@clickon.io.
                </p>
              </section>

              {/* Section 8 */}
              <section id="intellectual-property" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">08.</span> Intellectual Property Rights
                </h2>
                <p className="text-muted-foreground">
                  All software, algorithms, trademarks, visual styling, logos, and monorepo codebase components associated with ClickOn remain the exclusive property of ClickOn Inc. and its licensors.
                </p>
              </section>

              {/* Section 9 */}
              <section id="disclaimer" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">09.</span> Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground">
                  ClickOn is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 99.99% edge uptime, we make no express warranties regarding uninterrupted operation, absolute absence of bugs, or continuous accessibility of destination target servers outside our control.
                </p>
              </section>

              {/* Section 10 */}
              <section id="liability" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">10.</span> Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by applicable law, ClickOn Inc., its affiliates, and employees shall not be liable for any indirect, punitive, incidental, or consequential damages resulting from lost profits, service downtime, or content hosted on third-party destination servers.
                </p>
              </section>

              {/* Section 11 */}
              <section id="termination" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">11.</span> Suspension & Termination
                </h2>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account and deactivate any associated shortened links at our sole discretion, without notice, if we determine that you have violated these Terms or pose a security risk to the network.
                </p>
              </section>

              {/* Section 12 */}
              <section id="governing-law" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">12.</span> Governing Law & Dispute Resolution
                </h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed and interpreted in accordance with applicable laws without regard to conflict of law principles. Any dispute arising out of or relating to these Terms shall be resolved through good-faith negotiation prior to binding arbitration.
                </p>
              </section>

              {/* Section 13 */}
              <section id="contact-legal" className="space-y-3 scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="text-primary font-mono text-base">13.</span> Legal Inquiries & Notices
                </h2>
                <p className="text-muted-foreground">
                  For formal legal correspondence, DMCA takedown requests, or inquiries regarding these Terms, please reach our compliance team:
                </p>
                <div className="p-4 rounded-xl border bg-muted/30 text-xs font-mono space-y-1">
                  <p className="font-semibold text-foreground">ClickOn Compliance & Legal Team</p>
                  <p>Email: legal@clickon.io</p>
                  <p>Abuse Inquiries: abuse@clickon.io</p>
                  <p>Response Window: Within 1-2 business days</p>
                </div>
              </section>

              {/* Return to top */}
              <div className="pt-8 border-t flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="gap-2 text-xs text-muted-foreground"
                >
                  <ArrowUp className="h-4 w-4" />
                  Back to top
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
