import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Link2,
  ArrowRight,
  Menu,
  Sparkles,
  Info,
  Mail,
  FileText,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/auth.store';

interface PublicNavProps {
  activePage?: 'home' | 'about' | 'contact' | 'terms' | 'docs';
}

export function PublicNav({ activePage }: PublicNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const navLinks = [
    { label: 'Home', href: '/', icon: Sparkles, key: 'home' },
    { label: 'About Us', href: '/about', icon: Info, key: 'about' },
    { label: 'Contact', href: '/contact', icon: Mail, key: 'contact' },
    { label: 'Documentation', href: '/docs', icon: BookOpen, key: 'docs' },
    { label: 'Terms', href: '/terms', icon: FileText, key: 'terms' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-200">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight">ClickOn</span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive =
              activePage === item.key ||
              (item.key === 'home' && location.pathname === '/') ||
              (item.key !== 'home' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors duration-150 py-1 border-b-2 font-medium ${
                  isActive
                    ? 'text-foreground border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              Sign In
            </Button>
          ) : null}

          <Button
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2 shadow-sm font-medium"
          >
            <span className="hidden xs:inline">Dashboard</span>
            <LayoutDashboard className="h-4 w-4 xs:hidden" />
            <ArrowRight className="h-3.5 w-3.5 hidden xs:inline" />
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 p-0 flex flex-col">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">ClickOn</span>
                </div>
              </div>

              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  Navigation
                </p>
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t space-y-2 bg-muted/30">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/login');
                    }}
                  >
                    Sign In
                  </Button>
                ) : null}
                <Button
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
