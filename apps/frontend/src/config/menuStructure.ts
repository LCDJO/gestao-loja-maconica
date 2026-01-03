import {
  Users,
  ScrollText,
  Landmark,
  Banknote,
  Mail,
  BarChart3,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  Shield,
  MessageCircle,
  Bell,
  FileSignature,
  Heart,
  BookOpen,
  Trophy,
  Gift,
  CheckCircle,
  Activity,
  Star,
  Globe,
  Zap,
  Database,
  ArrowRightLeft,
  LineChart,
  Lock,
  Eye,
  Cog,
  User,
  Sliders,
  Settings,
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  submenu?: MenuItem[];
  requiredRole?: "member" | "admin" | "super-admin";
}

export interface MenuModule {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  description: string;
  items: MenuItem[];
  requiredRole?: "member" | "admin" | "super-admin";
}

export const menuModules: MenuModule[] = [
  {
    id: "secretaria",
    label: "Secretaria",
    icon: ScrollText,
    iconColor: "#3B82F6", // Azul
    description: "Gestão de pessoal, cadastros e comunicação",
    items: [
      {
        label: "Membros & Cadastros",
        icon: Users,
        href: "#members",
        submenu: [
          { label: "Lista de Irmãos", icon: Users, href: "/secretaria/irmaos" },
          { label: "Cadastro de Irmão", icon: Users, href: "/secretaria/irmaos/novo" },
          { label: "Cunhadas", icon: Users, href: "/secretaria/cunhadas" },
          { label: "Sobrinhos", icon: Users, href: "/secretaria/sobrinhos" },
          { label: "Aniversariantes", icon: Gift, href: "/secretaria/aniversariantes" },
          { label: "Pendências de Cadastro", icon: Clock, href: "/secretaria/pendencias" },
          { label: "Histórico de Membros", icon: FileText, href: "/secretaria/historico" },
        ],
      },
      {
        label: "Cronograma & Datas",
        icon: Calendar,
        href: "#schedule",
        submenu: [
          { label: "Cronograma de Eventos", icon: Calendar, href: "/secretaria/cronograma" },
          { label: "Sessões Marcadas", icon: Clock, href: "/secretaria/sessoes" },
          { label: "Datas Importantes", icon: Bell, href: "/secretaria/datas" },
          { label: "Calendário Maçônico", icon: Calendar, href: "/secretaria/calendario" },
        ],
      },
      {
        label: "Comunicação Interna",
        icon: Mail,
        href: "#communication",
        submenu: [
          { label: "Comunicados", icon: Mail, href: "/secretaria/comunicados" },
          { label: "Notificações", icon: Bell, href: "/secretaria/notificacoes" },
          { label: "Campanhas", icon: MessageCircle, href: "/secretaria/campanhas" },
          { label: "Templates de Email", icon: FileText, href: "/secretaria/templates" },
          { label: "Analytics de Comunicação", icon: BarChart3, href: "/secretaria/analytics-comunicacao" },
        ],
      },
      {
        label: "Documentação",
        icon: BookOpen,
        href: "#documentation",
        submenu: [
          { label: "Biblioteca", icon: BookOpen, href: "/secretaria/biblioteca" },
          { label: "Pranchas", icon: FileText, href: "/secretaria/pranchas" },
          { label: "Arquivo de Documentos", icon: FileText, href: "/secretaria/arquivo" },
          { label: "Normativas", icon: FileText, href: "/secretaria/normativas" },
        ],
      },
    ],
  },
  {
    id: "chancelaria",
    label: "Chancelaria",
    icon: FileSignature,
    iconColor: "#10B981", // Verde
    description: "Registros maçônicos e ações sociais",
    items: [
      {
        label: "Registros Maçônicos",
        icon: FileText,
        href: "#records",
        submenu: [
          { label: "Vida Maçônica", icon: Trophy, href: "/chancelaria/vida-maconica" },
          { label: "Histórico do Membro", icon: FileText, href: "/chancelaria/historico" },
          { label: "Graus e Promoções", icon: Trophy, href: "/chancelaria/graus" },
          { label: "Iniciações", icon: Star, href: "/chancelaria/iniciacoes" },
          { label: "Maçonaria Ativa", icon: Activity, href: "/chancelaria/ativa" },
        ],
      },
      {
        label: "Comissões & Órgãos",
        icon: Users,
        href: "#commissions",
        submenu: [
          { label: "Lista de Comissões", icon: Users, href: "/chancelaria/comissoes" },
          { label: "Membros de Comissões", icon: Users, href: "/chancelaria/membros-comissoes" },
          { label: "Estrutura Hierárquica", icon: Landmark, href: "/chancelaria/hierarquia" },
          { label: "Cargos e Funções", icon: Shield, href: "/chancelaria/cargos" },
        ],
      },
      {
        label: "Caridade & Ações Sociais",
        icon: Heart,
        href: "#charity",
        submenu: [
          { label: "Registros de Caridade", icon: Heart, href: "/chancelaria/caridade" },
          { label: "Projetos Sociais", icon: Globe, href: "/chancelaria/projetos" },
          { label: "Beneficiários", icon: Users, href: "/chancelaria/beneficiarios" },
          { label: "Impacto Social", icon: TrendingUp, href: "/chancelaria/impacto" },
        ],
      },
    ],
  },
  {
    id: "tesouraria",
    label: "Tesouraria",
    icon: Banknote,
    iconColor: "#8B5CF6", // Roxo
    description: "Gestão financeira e análise",
    items: [
      {
        label: "Fluxo Financeiro",
        icon: TrendingUp,
        href: "#flow",
        submenu: [
          { label: "Minhas Finanças", icon: Banknote, href: "/tesouraria/minhas-financas" },
          { label: "Transações", icon: ArrowRightLeft, href: "/tesouraria/transacoes" },
          { label: "Movimentação", icon: LineChart, href: "/tesouraria/movimentacao" },
          { label: "Fluxo de Caixa", icon: BarChart3, href: "/tesouraria/fluxo-caixa" },
        ],
      },
      {
        label: "Gestão de Contas",
        icon: Landmark,
        href: "#accounts",
        submenu: [
          { label: "Tesouraria Geral (Caixa)", icon: Landmark, href: "/tesouraria/caixa" },
          { label: "Contas Bancárias", icon: Banknote, href: "/tesouraria/contas" },
          { label: "Conciliação Bancária", icon: CheckCircle, href: "/tesouraria/conciliacao" },
          { label: "Contas a Pagar", icon: FileText, href: "/tesouraria/pagar" },
          { label: "Contas a Receber", icon: FileText, href: "/tesouraria/receber" },
        ],
      },
      {
        label: "Análise & Relatórios",
        icon: BarChart3,
        href: "#reports",
        submenu: [
          { label: "Dashboard Financeiro", icon: BarChart3, href: "/tesouraria/dashboard" },
          { label: "Relatório Financeiro", icon: FileText, href: "/tesouraria/relatorio" },
          { label: "Relatório ROI", icon: TrendingUp, href: "/tesouraria/roi" },
          { label: "Análise de Churn", icon: LineChart, href: "/tesouraria/churn" },
          { label: "Previsões", icon: Zap, href: "/tesouraria/previsoes" },
        ],
      },
    ],
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Settings,
    iconColor: "#6B7280", // Cinza
    description: "Configurações pessoais e de sistema",
    items: [
      { label: "Meu Perfil", icon: User, href: "/perfil" },
      { label: "Preferências", icon: Sliders, href: "/preferencias" },
      { label: "Segurança", icon: Shield, href: "/seguranca" },
      { label: "Integrações", icon: Zap, href: "/integracoes" },
      { label: "Backup & Dados", icon: Database, href: "/backup" },
    ],
  },
  {
    id: "administracao",
    label: "Administração",
    icon: Shield,
    iconColor: "#EF4444", // Vermelho
    description: "Gestão do sistema",
    requiredRole: "super-admin",
    items: [
      { label: "Gerenciamento de Usuários", icon: Users, href: "/admin/usuarios" },
      { label: "Permissões", icon: Lock, href: "/admin/permissoes" },
      { label: "Auditoria", icon: Eye, href: "/admin/auditoria" },
      { label: "Sistema", icon: Cog, href: "/admin/sistema" },
    ],
  },
];

// Função auxiliar para obter apenas módulos permitidos baseado no role
export function getModulesByRole(userRole?: string): MenuModule[] {
  return menuModules.filter((module) => {
    if (!module.requiredRole) return true;
    return module.requiredRole === userRole;
  });
}

// Função auxiliar para obter um módulo específico
export function getModuleById(id: string): MenuModule | undefined {
  return menuModules.find((module) => module.id === id);
}

// Função auxiliar para obter todos os itens de um módulo (flat)
export function getModuleItems(moduleId: string): MenuItem[] {
  const module = getModuleById(moduleId);
  if (!module) return [];
  return module.items;
}
