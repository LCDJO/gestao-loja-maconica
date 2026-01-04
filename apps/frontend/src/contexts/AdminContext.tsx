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
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string, lodgeId: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar token com backend
  const validateTokenWithBackend = async (storedToken: string, lodgeId: string) => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/auth/admin/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Token inválido ou expirado");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Validar que o lodgeId no token corresponde ao armazenado
        if (data.data.lodgeId !== lodgeId) {
          throw new Error("Loja não corresponde ao token");
        }
        setUser(data.data);
        setToken(storedToken);
        setError(null);
        return true;
      } else {
        throw new Error(data.error || "Erro ao validar token");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao validar token";
      setError(errorMessage);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminLodgeId");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminLodgeName");
      return false;
    }
  };

  // Restaurar sessão ao inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const lodgeId = localStorage.getItem("adminLodgeId");
    
    if (storedToken && lodgeId) {
      validateTokenWithBackend(storedToken, lodgeId);
    }
    
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string, lodgeId: string) => {
    try {
      setError(null);
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
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      setError(errorMessage);
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
    setError(null);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        isInitialized,
        error,
        login,
        logout,
      }}
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
