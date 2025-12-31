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
  TrendingUp,
  ChevronDown,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationCenter from "@/components/NotificationCenter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    modules: true,
    communication: false,
    reports: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navSections = [
    {
      id: "modules",
      label: "Módulos",
      items: [
        { label: "Painel Geral", icon: LayoutDashboard, href: "/" },
        { label: "Dashboard Executivo", icon: BarChart3, href: "/dashboard-executivo" },
        { label: "Secretaria", icon: ScrollText, href: "/secretaria" },
        { label: "Chancelaria", icon: Users, href: "/chancelaria" },
        { label: "Tesouraria", icon: Landmark, href: "/tesouraria" },
      ]
    },
    {
      id: "communication",
      label: "Comunicação",
      items: [
        { label: "Comunicados", icon: Mail, href: "/comunicados" },
        { label: "Notificações", icon: Mail, href: "/notificacoes" },
        { label: "Templates", icon: FileText, href: "/editor-templates" },
        { label: "Campanhas", icon: Clock, href: "/agendamento-campanhas" },
        { label: "Analytics", icon: BarChart3, href: "/analytics-notificacoes" },
        { label: "Google Calendar", icon: Calendar, href: "/google-calendar" },
      ]
    },
    {
      id: "reports",
      label: "Relatórios & Análise",
      items: [
        { label: "Relatórios", icon: PieChart, href: "/relatorios" },
        { label: "ROI", icon: TrendingUp, href: "/relatorio-roi" },
        { label: "Churn", icon: TrendingUp, href: "/relatorio-churn" },
      ]
    },

  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Facebook Business Style */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area - Facebook Style */}
          <div className="h-20 flex items-center px-4 border-b border-gray-200">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                G
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-sans font-bold text-base text-gray-900 leading-tight">G:.O:.D:.F:.</h1>
                <p className="text-xs text-gray-500 font-normal">Gestão de Loja</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Facebook Style */}
          <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.id} className="mb-4">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="tracking-wide">{section.label}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedSections[section.id] ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Section Items */}
                {expandedSections[section.id] && (
                  <div className="space-y-1 mt-2">
                    {section.items.map((item) => {
                      const isActive = location === item.href || location.startsWith(`${item.href}/`);
                      return (
                        <Link key={item.href} href={item.href}>
                          <div 
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-sm font-medium",
                              isActive 
                                ? "bg-blue-50 text-blue-600" 
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-gray-600")} />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Settings & User Profile - Facebook Style */}
          <div className="border-t border-gray-200 p-3 space-y-3 bg-gray-50">
            {/* Settings Button */}
            <Link href="/parametrizacao">
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer text-sm font-medium text-gray-700 transition-colors">
                <Settings className="h-4 w-4 text-gray-600" />
                <span>Parametrização</span>
              </div>
            </Link>

            {/* User Profile */}
            <div className="px-3 py-2 bg-white rounded-md border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  VM
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">Venerável Mestre</p>
                  <p className="text-xs text-gray-500">Loja Exemplo #123</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-center text-xs font-medium text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <LogOut className="h-3 w-3 mr-2" /> Sair
              </Button>
            </div>

            {/* Portal do Membro Link */}
            <Link href="/membro/login">
              <div className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
                → Portal do Membro
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-gray-600">
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-bold text-gray-900">Gestão Maçônica</span>
          </div>
          <NotificationCenter />
        </header>

        {/* Desktop Header with Notifications */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center px-8 justify-end shadow-sm z-40">
          <NotificationCenter />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 relative lg:mt-0">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
