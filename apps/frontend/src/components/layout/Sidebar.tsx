import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Key,
  Users,
  Link2,
  Lock,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/store/auth.store';

interface SidebarContentProps {
  onClose?: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Project Docs',
    href: '/docs',
    icon: BookOpen,
  },
];

const futureItems = [
  { label: 'Settings', icon: Settings },
  { label: 'API Keys', icon: Key },
  { label: 'Team', icon: Users },
];

export function SidebarContent({ onClose }: SidebarContentProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">ClickOn</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4.5 w-4.5', isActive && 'text-primary')} />
              {item.label}
            </Link>
          );
        })}

        <Separator className="my-3" />

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Coming Soon
        </p>
        {futureItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
          >
            <item.icon className="h-4.5 w-4.5" />
            <span className="flex-1">{item.label}</span>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <Badge
                variant="outline"
                className="text-[9px] px-1 py-0 border-muted-foreground/20 text-muted-foreground/50"
              >
                Soon
              </Badge>
            </div>
          </div>
        ))}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email || 'user@clickon.io'}</p>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] px-1.5 py-0 font-bold',
                user?.role === 'PRO'
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {user?.role || 'FREE'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              onClose?.();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card/50 backdrop-blur min-h-screen fixed left-0 top-0 z-30">
      <SidebarContent />
    </aside>
  );
}
