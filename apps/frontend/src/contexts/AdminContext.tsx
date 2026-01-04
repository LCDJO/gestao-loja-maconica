import React, { createContext, useState, ReactNode, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  role: "ADMIN";
  lodgeId: string;
  lodgeName: string;
}

interface AdminContextType {
  user: AdminUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, lodgeId: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restaurar sessão ao inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const lodgeId = localStorage.getItem("adminLodgeId");
    
    if (storedToken && lodgeId) {
      setToken(storedToken);
      // TODO: Validar token com backend
      // Por enquanto, assumimos que o token é válido
      setUser({
        id: "admin-1",
        email: localStorage.getItem("adminEmail") || "admin@loja.masonica.org",
        role: "ADMIN",
        lodgeId,
        lodgeName: localStorage.getItem("adminLodgeName") || "Loja Principal",
      });
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string, lodgeId: string) => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/auth/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, lodgeId }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminRefreshToken", data.data.refreshToken);
      localStorage.setItem("adminLodgeId", lodgeId);
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("adminLodgeName", data.data.user?.lodgeName || "Loja Principal");
      setToken(data.data.token);
      setUser(data.data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminLodgeId");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminLodgeName");
    setToken(null);
    setUser(null);
  };

  return (
    <AdminContext.Provider
      value={{ user, token, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAuth() {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminAuth deve ser usado dentro de AdminProvider");
  }
  return context;
}
