import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useMemberAuth } from "@/contexts/MemberAuthContext";

interface MemberPortalLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/member-portal/dashboard",
    icon: "📊",
  },
  {
    id: "personal-data",
    label: "Meus Dados",
    href: "/member-portal/personal-data",
    icon: "👤",
  },
  {
    id: "financial",
    label: "Histórico Financeiro",
    href: "/member-portal/financial-history",
    icon: "💰",
  },
  {
    id: "documents",
    label: "Documentos",
    href: "/member-portal/documents",
    icon: "📄",
  },
  {
    id: "attendance",
    label: "Histórico de Presença",
    href: "/member-portal/attendance",
    icon: "✓",
  },
];

export default function MemberPortalLayout({
  children,
  currentPage,
}: MemberPortalLayoutProps) {
  const [, setLocation] = useLocation();
  const { logout } = useMemberAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setLocation("/member-portal/auth/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, redirecionar
      setLocation("/member-portal/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Overlay para Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-full lg:h-auto bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-bold text-blue-600">Portal do Irmão</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Bem-vindo</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setLocation(item.href);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition ${
                currentPage === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2 sm:mr-3">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base text-red-600 hover:bg-red-50 transition flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{isLoggingOut ? "Saindo..." : "Sair"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-900">Irmão</p>
                <p className="text-gray-500 text-xs">Minha Conta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
