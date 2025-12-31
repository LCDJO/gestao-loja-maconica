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
  Calendar,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationCenter from "@/components/NotificationCenter";
import { userPermissionsStore } from "@/lib/store";
import { Lock } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: any;
  href: string;
  submenu?: NavItem[];
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    modules: true,
    communication: false,
    reports: false,
    parameters: false,
  });
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  const userPermissions = userPermissionsStore.getCurrentUser();
  const canAccessParametros = userPermissionsStore.canAccessParametros();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSubmenu = (key: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navSections: NavSection[] = [
    {
      id: "modules",
      label: "Módulos",
      items: [
        { label: "Painel Geral", icon: LayoutDashboard, href: "/" },
        { label: "Dashboard Executivo", icon: BarChart3, href: "/dashboard-executivo" },
        ...(userPermissions.permissions.secretaria ? [{ label: "Secretaria", icon: ScrollText, href: "/secretaria" }] : []),
        ...(userPermissions.permissions.chancelaria ? [{ label: "Chancelaria", icon: Users, href: "/chancelaria" }] : []),
        ...(userPermissions.permissions.tesouraria ? [{ label: "Tesouraria", icon: Landmark, href: "/tesouraria" }] : []),
      ]
    },
    ...(userPermissions.permissions.comunicados || userPermissions.permissions.agendamentoCampanhas ? [{
      id: "communication",
      label: "Ações de Comunicação",
      items: [
        ...(userPermissions.permissions.comunicados ? [{ label: "Comunicados", icon: Mail, href: "/comunicados" }] : []),
        ...(userPermissions.permissions.agendamentoCampanhas ? [{ label: "Agendamento de Campanhas", icon: Clock, href: "/agendamento-campanhas" }] : []),
      ]
    }] : []),
    ...(userPermissions.permissions.relatorios || userPermissions.permissions.roi || userPermissions.permissions.churn ? [{
      id: "reports",
      label: "Relatórios & Análise",
      items: [
        ...(userPermissions.permissions.relatorios ? [{ label: "Relatórios", icon: PieChart, href: "/relatorios" }] : []),
        ...(userPermissions.permissions.roi ? [{ label: "ROI", icon: TrendingUp, href: "/relatorio-roi" }] : []),
        ...(userPermissions.permissions.churn ? [{ label: "Churn", icon: TrendingUp, href: "/relatorio-churn" }] : []),
      ]
    }] : []),
    {
      id: "parameters",
      label: "Configurações",
      items: [
        { label: "Configurações da Loja", icon: Settings, href: "/configuracoes-loja" },
        { 
          label: "Integrações", 
          icon: Mail, 
          href: "#integrações",
          submenu: [
            { label: "Email (SendGrid/Mailgun)", icon: Mail, href: "/configuracao-email" },
            { label: "Google Calendar", icon: Calendar, href: "/google-calendar" },
            { label: "OneSignal", icon: Mail, href: "/configuracoes-push" },
          ]
        },
        { 
          label: "Templates", 
          icon: FileText, 
          href: "#templates",
          submenu: [
            { label: "Notificações", icon: FileText, href: "/templates-notificacao" },
            { label: "Editor Visual", icon: FileText, href: "/editor-templates" },
          ]
        },
        { 
          label: "Agendamentos", 
          icon: Clock, 
          href: "#agendamentos",
          submenu: [
            { label: "Relatórios", icon: Clock, href: "/agendamento-relatorios" },
          ]
        },
        { 
          label: "Analytics", 
          icon: BarChart3, 
          href: "#analytics",
          submenu: [
            { label: "Notificau00e7u00f5es", icon: BarChart3, href: "/analytics-notificacoes" },
            { label: "Push", icon: BarChart3, href: "/analytics-push" },
          ]
        },
        { 
          label: "Segurança", 
          icon: Shield, 
          href: "#seguranca",
          submenu: [
            { label: "Gerenciamento de Usuários", icon: Users, href: "/gerenciamento-usuarios" },
            { label: "Auditoria de Acesso", icon: BarChart3, href: "/auditoria-acesso" },
          ]
        },
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
                      const submenuKey = `${section.id}-${item.label}`;
                      const hasSubmenu = item.submenu && item.submenu.length > 0;

                      return (
                        <div key={item.label}>
                          {hasSubmenu ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleSubmenu(submenuKey);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                                "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-gray-600" />
                                <span>{item.label}</span>
                              </div>
                              <ChevronDown 
                                className={cn(
                                  "h-3 w-3 transition-transform",
                                  expandedSubmenus[submenuKey] ? "rotate-180" : ""
                                )}
                              />
                            </button>
                          ) : (
                            <Link href={item.href}>
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
                          )}

                          {/* Submenu Items */}
                          {hasSubmenu && expandedSubmenus[submenuKey] && (
                            <div className="space-y-1 mt-1 ml-4 border-l border-gray-200 pl-2">
                              {item.submenu!.map((subitem) => {
                                const isSubActive = location === subitem.href || location.startsWith(`${subitem.href}/`);
                                return (
                                  <Link key={subitem.href} href={subitem.href}>
                                    <div 
                                      className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-sm",
                                        isSubActive 
                                          ? "bg-blue-50 text-blue-600 font-medium" 
                                          : "text-gray-600 hover:bg-gray-100"
                                      )}
                                    >
                                      <subitem.icon className={cn("h-3 w-3", isSubActive ? "text-blue-600" : "text-gray-500")} />
                                      <span>{subitem.label}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
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
                <span>Parametrização Avançada</span>
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
                Portal do Membro
              </div>
            </Link>

            {/* Version Footer */}
            <Link href="/changelog">
              <div className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-200 mt-3 pt-3 text-center">
                <span className="block font-bold text-gray-600">v2.5.0</span>
                <span className="block text-gray-400 text-xs mt-1">Ver changelog</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          <NotificationCenter />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
