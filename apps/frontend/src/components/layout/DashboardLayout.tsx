import { useState, useEffect } from "react";
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
  Shield,
  MessageCircle,
  Bell,
  FileSignature,
  HardDrive,
  Search,
  Heart,
  BookOpen,
  Trophy,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationCenter from "@/components/NotificationCenter";
import { userPermissionsStore, integrationStatusStore } from "@/lib/store";
import { Lock, Circle } from "lucide-react";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    modules: true,
    communication: false,
    reports: false,
    parameters: false,
  });
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  const [integrationStatuses, setIntegrationStatuses] = useState(integrationStatusStore.getAll());
  const userPermissions = userPermissionsStore.getCurrentUser();
  const canAccessParametros = userPermissionsStore.canAccessParametros();

  // Atualizar status de integrações quando componente monta
  useEffect(() => {
    setIntegrationStatuses(integrationStatusStore.getAll());
  }, []);

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
      id: "dashboards",
      label: "Painéis",
      items: [
        { label: "Painel Geral", icon: LayoutDashboard, href: "/" },
        { label: "Dashboard Executivo", icon: BarChart3, href: "/dashboard-executivo" },
        { label: "Dashboard do Membro", icon: Users, href: "/membro/dashboard" },
      ]
    },
    {
      id: "domains",
      label: "Domínios",
      items: [
        // Financeiro
        { 
          label: "Financeiro", 
          icon: Banknote, 
          href: "#financeiro",
          submenu: [
            { label: "Minhas Finanças", icon: Banknote, href: "/financeiro" },
            { label: "Tesouraria", icon: Landmark, href: "/tesouraria" },
            { label: "Conciliação", icon: FileText, href: "/conciliacao" },
          ]
        },
        // Irmãos (Membros)
        { 
          label: "Irmãos", 
          icon: Users, 
          href: "#irmaos",
          submenu: [
            { label: "Lista de Irmãos", icon: Users, href: "/irmaos" },
            { label: "Pendências", icon: Clock, href: "/membro/pendencias" },
            { label: "Histórico", icon: FileText, href: "/membro/historico" },
            { label: "Notificações", icon: Bell, href: "/membro/notificacoes" },
          ]
        },
        // Vida Maçônica
        { 
          label: "Vida Maçônica", 
          icon: Trophy, 
          href: "#vida-maconica",
          submenu: [
            { label: "Vida Maçônica", icon: Trophy, href: "/vida-maconica" },
            { label: "Cronograma", icon: Calendar, href: "/cronograma" },
          ]
        },
        // Aniversariantes
        { 
          label: "Aniversariantes", 
          icon: Gift, 
          href: "/aniversariantes",
        },
        // Caridade
        { 
          label: "Caridade", 
          icon: Heart, 
          href: "#caridade",
          submenu: [
            { label: "Registros de Caridade", icon: Heart, href: "/caridade" },
          ]
        },
        // Biblioteca
        { 
          label: "Biblioteca", 
          icon: BookOpen, 
          href: "#biblioteca",
          submenu: [
            { label: "Catálogo", icon: BookOpen, href: "/biblioteca" },
          ]
        },
        // Comissões
        { 
          label: "Comissões", 
          icon: Users, 
          href: "#comissoes",
          submenu: [
            { label: "Lista de Comissões", icon: Users, href: "/comissoes" },
          ]
        },
        // Pranchas
        { 
          label: "Pranchas", 
          icon: FileText, 
          href: "#pranchas",
          submenu: [
            { label: "Lista de Pranchas", icon: FileText, href: "/pranchas" },
          ]
        },
        // Administração
        { 
          label: "Administração", 
          icon: Shield, 
          href: "#admin",
          submenu: [
            { label: "Painel Admin", icon: Shield, href: "/administracao" },
            { label: "Gerenciamento de Usuários", icon: Users, href: "/gerenciamento-usuarios" },
            { label: "Auditoria de Acesso", icon: BarChart3, href: "/auditoria-acesso" },
            { label: "Permissões", icon: Lock, href: "/permissoes" },
            { label: "Auditoria Geral", icon: BarChart3, href: "/auditoria" },
          ]
        },
        // Secretaria
        { 
          label: "Secretaria", 
          icon: ScrollText, 
          href: "#secretaria",
          submenu: [
            { label: "Secretaria", icon: ScrollText, href: "/secretaria" },
            { label: "Comunicados", icon: Mail, href: "/comunicados" },
          ]
        },
        // Chancelaria
        { 
          label: "Chancelaria", 
          icon: Users, 
          href: "#chancelaria",
          submenu: [
            { label: "Chancelaria", icon: Users, href: "/chancelaria" },
          ]
        },
        // Sistema
        { 
          label: "Sistema", 
          icon: Settings, 
          href: "#sistema",
          submenu: [
            { label: "Dados da Loja", icon: Settings, href: "/sistema" },
          ]
        },
      ]
    },
    {
      id: "communications",
      label: "Comunicação & Campanhas",
      items: [
        { 
          label: "Campanhas", 
          icon: Mail, 
          href: "#campanhas",
          submenu: [
            { label: "Agendamento de Campanhas", icon: Clock, href: "/agendamento-campanhas" },
            { label: "Automação de Campanhas", icon: Clock, href: "/automacao-campanhas" },
          ]
        },
        { 
          label: "Notificações", 
          icon: Bell, 
          href: "#notificacoes",
          submenu: [
            { label: "Notificações Email", icon: Mail, href: "/notificacoes-email" },
            { label: "Analytics de Notificações", icon: BarChart3, href: "/analytics-notificacoes" },
            { label: "Analytics de Push", icon: BarChart3, href: "/analytics-push" },
            { label: "Templates de Notificação", icon: FileText, href: "/templates-notificacao" },
            { label: "Agendamento de Relatórios", icon: Clock, href: "/agendamento-relatorios" },
          ]
        },
      ]
    },
    {
      id: "analytics",
      label: "Relatórios & Análises",
      items: [
        { label: "Relatórios Geral", icon: PieChart, href: "/relatorios" },
        { label: "Análise ROI", icon: TrendingUp, href: "/relatorio-roi" },
        { label: "Análise de Churn", icon: TrendingUp, href: "/relatorio-churn" },
        { label: "Histórico de Testes", icon: BarChart3, href: "/historico-testes-evolution" },
      ]
    },
    {
      id: "config",
      label: "Configurações da Loja",
      items: [
        { label: "Dashboard Config", icon: Settings, href: "/config" },
        { label: "Dados da Loja", icon: Settings, href: "/config/loja" },
        { label: "Usuários", icon: Users, href: "/config/usuarios" },
        { label: "Permissões", icon: Lock, href: "/config/permissoes" },
        { label: "Email", icon: Mail, href: "/config/email" },
        { label: "Push Notifications", icon: Bell, href: "/config/push" },
        { label: "Parametrização", icon: Settings, href: "/config/parametrizacao" },
        { label: "Backup", icon: HardDrive, href: "/config/backup" },
        { label: "Comunicados", icon: Mail, href: "/config/comunicados" },
        { label: "Auditoria", icon: BarChart3, href: "/config/auditoria" },
        { label: "Auditoria de Acesso", icon: Shield, href: "/config/acesso" },
        { label: "Changelog", icon: FileText, href: "/config/changelog" },
      ]
    },
    {
      id: "integrations",
      label: "Integrações de Sistema",
      items: [
        { label: "Dashboard Integrações", icon: Settings, href: "/integracao" },
        { 
          label: "Pagamentos", 
          icon: Banknote, 
          href: "#integracao-pagamentos",
          submenu: [
            { label: "Stripe", icon: Banknote, href: "/integracao/pagamentos" },
            { label: "PagSeguro", icon: Banknote, href: "/integracao/pagamentos#pagseguro" },
            { label: "Pix", icon: Banknote, href: "/integracao/pagamentos#pix" },
          ]
        },
        { 
          label: "Notificações", 
          icon: Bell, 
          href: "#integracao-notificacoes",
          submenu: [
            { label: "OneSignal", icon: Bell, href: "/integracao/notificacoes/onesignal" },
            { label: "Firebase", icon: Bell, href: "/integracao/notificacoes/firebase" },
            { label: "AWS SNS", icon: Bell, href: "/integracao/notificacoes/sns" },
          ]
        },
        { 
          label: "Agendamento", 
          icon: Calendar, 
          href: "#integracao-agendamento",
          submenu: [
            { label: "Google Calendar", icon: Calendar, href: "/integracao/agendamento/google" },
            { label: "Outlook", icon: Calendar, href: "/integracao/agendamento/outlook" },
          ]
        },
        { 
          label: "Armazenamento", 
          icon: HardDrive, 
          href: "#integracao-armazenamento",
          submenu: [
            { label: "Google Drive", icon: HardDrive, href: "/integracao/armazenamento/google" },
            { label: "AWS S3", icon: HardDrive, href: "/integracao/armazenamento/s3" },
            { label: "Azure", icon: HardDrive, href: "/integracao/armazenamento/azure" },
          ]
        },
        { 
          label: "Analytics", 
          icon: BarChart3, 
          href: "#integracao-analytics",
          submenu: [
            { label: "Google Analytics", icon: BarChart3, href: "/integracao/analytics/google" },
            { label: "Umami", icon: BarChart3, href: "/integracao/analytics/umami" },
            { label: "Hotjar", icon: BarChart3, href: "/integracao/analytics/hotjar" },
          ]
        },
        { 
          label: "RH", 
          icon: Users, 
          href: "#integracao-rh",
          submenu: [
            { label: "Guia de Pontos", icon: Users, href: "/integracao/rh/guia" },
            { label: "Zoho", icon: Users, href: "/integracao/rh/zoho" },
          ]
        },
        { 
          label: "ERP", 
          icon: Shield, 
          href: "#integracao-erp",
          submenu: [
            { label: "SAP", icon: Shield, href: "/integracao/erp/sap" },
            { label: "TOTVS", icon: Shield, href: "/integracao/erp/totvs" },
            { label: "OpenERP", icon: Shield, href: "/integracao/erp/openerp" },
          ]
        },
        { 
          label: "Comunicação", 
          icon: MessageCircle, 
          href: "#integracao-comunicacao",
          submenu: [
            { label: "WhatsApp", icon: MessageCircle, href: "/integracao/comunicacao/whatsapp" },
            { label: "Telegram", icon: MessageCircle, href: "/integracao/comunicacao/telegram" },
            { label: "Email", icon: Mail, href: "/integracao/comunicacao/email" },
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

          {/* Search Bar */}
          <div className="px-3 py-3 border-b border-gray-200">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm text-gray-600"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Buscar...</span>
              <kbd className="text-xs bg-white px-2 py-1 rounded border border-gray-300">Cmd+K</kbd>
            </button>
          </div>

          {/* Navigation - Facebook Style */}
          <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.id} className="mb-4">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-md transition-colors mt-3 mb-1"
                >
                  <span className="tracking-wider uppercase text-gray-600">{section.label}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform text-gray-500",
                      expandedSections[section.id] ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Section Items */}
                {expandedSections[section.id] && (
                  <div className="space-y-0.5 mt-2">
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
                                "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
                                expandedSubmenus[submenuKey] ? "bg-gray-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"
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
                                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer text-sm font-medium",
                                  isActive 
                                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600" 
                                    : "text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-gray-600")} />
                                <span>{item.label}</span>
                              </div>
                            </Link>
                          )}

                          {/* Submenu Items */}
                          {hasSubmenu && expandedSubmenus[submenuKey] && (
                            <div className="space-y-0.5 mt-1 ml-3 border-l border-gray-200 pl-3">
                              {item.submenu!.map((subitem) => {
                                const isSubActive = location === subitem.href || location.startsWith(`${subitem.href}/`);
                                const integrationStatus = integrationStatuses.find(
                                  s => s.name.toLowerCase().includes(subitem.label.toLowerCase())
                                );
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
                                      <span className="flex-1">{subitem.label}</span>
                                      {integrationStatus && (
                                        <Circle 
                                          className={cn(
                                            "h-2 w-2 fill-current",
                                            integrationStatus.connected ? "text-green-500" : "text-red-500"
                                          )}
                                        />
                                      )}
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
