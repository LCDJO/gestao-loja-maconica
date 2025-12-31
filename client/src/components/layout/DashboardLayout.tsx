import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  ScrollText, 
  Landmark, 
  PieChart,
  Menu, 
  X,
  LogOut,
  Settings,
  Banknote,
  Mail,
  BarChart3,
  FileText,
  Clock,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  const navItems = [
    { 
      label: "Painel Geral", 
      icon: LayoutDashboard, 
      href: "/" 
    },
    { 
      label: "Secretaria", 
      icon: ScrollText, 
      href: "/secretaria" 
    },
    { 
      label: "Chancelaria", 
      icon: Users, 
      href: "/chancelaria" 
    },
    { 
      label: "Tesouraria", 
      icon: Landmark, 
      href: "/tesouraria" 
    },
    { 
      label: "Relatórios", 
      icon: PieChart, 
      href: "/relatorios" 
    },
    { 
      label: "Configurações", 
      icon: Settings, 
      href: "/configuracoes" 
    },
    { 
      label: "Conciliação", 
      icon: Banknote, 
      href: "/conciliacao" 
    },
    { 
      label: "Notificações", 
      icon: Mail, 
      href: "/notificacoes" 
    },
    { 
      label: "Analytics", 
      icon: BarChart3, 
      href: "/analytics-notificacoes" 
    },
    { 
      label: "Templates", 
      icon: FileText, 
      href: "/templates-notificacao" 
    },
    { 
      label: "Campanhas", 
      icon: Clock, 
      href: "/agendamento-campanhas" 
    },
    { 
      label: "ROI", 
      icon: TrendingUp, 
      href: "/relatorio-roi" 
    },
  ];

  const memberPortalItems = [
    { label: "Portal do Membro", href: "/membro/login" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out shadow-xl border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-sidebar-border bg-sidebar-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <img src="/images/logo-placeholder.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg tracking-wider text-sidebar-primary">G:.O:.D:.F:.</h1>
                <p className="text-xs text-sidebar-foreground/70 font-serif italic">Gestão de Loja</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 cursor-pointer group",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />
                    <span className={cn("font-medium tracking-wide", isActive ? "font-semibold" : "")}>{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/5">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary border border-sidebar-primary/30">
                <span className="font-display font-bold text-xs">VM</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Venerável Mestre</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">Loja Exemplo #123</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Settings className="h-3 w-3 mr-2" /> Config
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs border-sidebar-border text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                <LogOut className="h-3 w-3 mr-2" /> Sair
              </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar-accent/5">
            <a href="/membro/login" className="text-sm text-primary hover:underline font-medium">
              → Portal do Membro
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-background border-b border-border flex items-center px-4 justify-between shadow-sm z-40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-display font-bold text-primary">Gestão Maçônica</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-8 relative">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
