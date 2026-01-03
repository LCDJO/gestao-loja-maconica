import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("memberToken");
    setLocation("/member/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Portal do Irmão</h1>
          <p className="text-xs text-gray-500 mt-1">Bem-vindo</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setLocation(item.href)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                currentPage === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Irmão</p>
                <p className="text-gray-500">Minha Conta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
