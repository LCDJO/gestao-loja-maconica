import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LogOut, Home, FileText, History, Bell } from 'lucide-react';
import { useMemberAuth } from '@/contexts/MemberAuthContext';

interface MemberPortalLayoutProps {
  children: ReactNode;
}

export default function MemberPortalLayout({ children }: MemberPortalLayoutProps) {
  const { currentMember, logout } = useMemberAuth();
  const [, navigate] = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/membro/dashboard' },
    { label: 'Pendências', icon: FileText, href: '/membro/pendencias' },
    { label: 'Histórico', icon: History, href: '/membro/historico' },
    { label: 'Notificações', icon: Bell, href: '/membro/notificacoes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/membro/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div>
            <h1 className="font-display text-xl font-bold">Portal do Irmão</h1>
            <p className="text-sm text-primary-foreground/80">{currentMember?.name}</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-primary/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:block">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate(item.href)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
