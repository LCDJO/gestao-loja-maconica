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
  Palette,
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
    id: "super-admin",
    label: "Super Admin",
    icon: Shield,
    iconColor: "#EF4444", // Vermelho
    description: "Gestão completa do sistema e da loja",
    requiredRole: "super-admin",
    items: [
      {
        label: "Secretaria",
        icon: ScrollText,
        href: "#secretaria",
        submenu: [
          { label: "Membros da Loja", icon: Users, href: "/admin/secretaria/membros" },
          { label: "Candidatos", icon: Users, href: "/admin/secretaria/candidatos" },
          { label: "Sessões", icon: Calendar, href: "/admin/secretaria/sessoes" },
          { label: "Balaústres", icon: Users, href: "/admin/secretaria/balaustres" },
          { label: "Usuários", icon: Users, href: "/admin/secretaria/usuarios" },
        ],
      },
      {
        label: "Chancelaria",
        icon: FileSignature,
        href: "#chancelaria",
        submenu: [
          { label: "Frequências", icon: CheckCircle, href: "/admin/chancelaria/frequencias" },
          { label: "Diário de Frequência", icon: FileText, href: "/admin/chancelaria/diario" },
          { label: "Visitas Realizadas", icon: Globe, href: "/admin/chancelaria/visitas-realizadas" },
          { label: "Visitas Recebidas", icon: Globe, href: "/admin/chancelaria/visitas-recebidas" },
        ],
      },
      {
        label: "Tesouraria",
        icon: Banknote,
        href: "#tesouraria",
        submenu: [
          { label: "Receitas", icon: TrendingUp, href: "/admin/tesouraria/receitas" },
          { label: "Despesas", icon: TrendingUp, href: "/admin/tesouraria/despesas" },
          { label: "Contas", icon: Landmark, href: "/admin/tesouraria/contas" },
          { label: "Meu Extrato", icon: LineChart, href: "/admin/tesouraria/extrato" },
        ],
      },
      {
        label: "Presidência",
        icon: Landmark,
        href: "#presidencia",
        submenu: [
          { label: "Administrações", icon: Shield, href: "/admin/presidencia/administracoes" },
          { label: "Comissões", icon: Users, href: "/admin/presidencia/comissoes" },
        ],
      },
      {
        label: "Relatórios",
        icon: BarChart3,
        href: "#relatorios",
        submenu: [
          { label: "Relatórios Gerais", icon: FileText, href: "/admin/relatorios" },
          { label: "Exportar Dados", icon: Database, href: "/admin/relatorios/exportar" },
        ],
      },
      {
        label: "Configurações da Loja",
        icon: Cog,
        href: "#configuracoes",
        submenu: [
          { label: "Parâmetros Gerais", icon: Settings, href: "/admin/configuracoes/geral" },
          { label: "Segurança", icon: Lock, href: "/admin/configuracoes/seguranca" },
          { label: "Backup & Recuperação", icon: Database, href: "/admin/configuracoes/backup" },
          { label: "Logs de Auditoria", icon: Eye, href: "/admin/configuracoes/auditoria" },
        ],
      },
      {
        label: "Integrações de Sistema",
        icon: Zap,
        href: "#integracoes",
        submenu: [
          { label: "Email", icon: Mail, href: "/admin/integracoes/email" },
          { label: "WhatsApp Evolution", icon: MessageCircle, href: "/admin/integracoes/evolution" },
          { label: "OneSignal Push", icon: Bell, href: "/admin/integracoes/onesignal" },
          { label: "Pagamentos", icon: Banknote, href: "/admin/integracoes/pagamentos" },
        ],
      },
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
