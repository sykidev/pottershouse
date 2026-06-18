import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Video,
  Calendar,
  Megaphone,
  Users,
  FileText,
  BookOpen,
  PanelBottom,
  MapPin,
  HandHeart,
  Sparkles,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  async function handleLogout() {
    await logout();
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/sermons', label: 'Sermons', icon: Video },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/team', label: 'Team', icon: Users },
    { href: '/admin/about-cards', label: 'About Page', icon: BookOpen },
    { href: '/admin/visit', label: 'Visit Us Page', icon: MapPin },
    { href: '/admin/ministries', label: 'Ministries Page', icon: Sparkles },
    { href: '/admin/give', label: 'Give Page', icon: HandHeart },
    { href: '/admin/footer', label: 'Footer', icon: PanelBottom },
    { href: '/admin/content', label: 'Content', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-warm-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-crimson-950 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-serif font-bold">CMS Admin</h1>
          <p className="text-sm text-white/60 mt-1">Logged in as {user?.username}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
