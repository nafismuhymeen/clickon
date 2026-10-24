import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t bg-card/40 backdrop-blur-sm z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <Link2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">ClickOn</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              High-performance URL shortening and link intelligence platform. Built with modern micro-services, real-time analytics, and lightning-fast redirection at the edge.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational (99.99%)
              </div>
            </div>
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  URL Shortener
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  Link Analytics
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-foreground transition-colors">
                  API & SDKs
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground/60">
                  Custom Domains <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-semibold">PRO</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground/60">
                  Careers <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">We're hiring</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/terms#privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms#acceptable-use" className="hover:text-foreground transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <Link to="/contact?topic=abuse" className="hover:text-foreground transition-colors">
                  Report Malicious Link
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ClickOn Inc. Crafted with speed and precision.</p>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms & Privacy
            </Link>
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
