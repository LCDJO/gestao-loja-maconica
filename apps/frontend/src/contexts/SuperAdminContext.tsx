import React, { createContext, useState, ReactNode, useEffect } from "react";

interface SuperAdminUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN";
}

interface SuperAdminContextType {
  user: SuperAdminUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(
  undefined
);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restaurar sessão ao inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem("superAdminToken");
    if (storedToken) {
      setToken(storedToken);
      // TODO: Validar token com backend
      // Por enquanto, assumimos que o token é válido
      setUser({
        id: "super-admin-1",
        email: localStorage.getItem("superAdminEmail") || "master@masonica.org",
        role: "SUPER_ADMIN",
      });
    }
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/auth/super-admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("superAdminToken", data.data.token);
      localStorage.setItem("superAdminRefreshToken", data.data.refreshToken);
      localStorage.setItem("superAdminEmail", email);
      setToken(data.data.token);
      setUser(data.data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminRefreshToken");
    localStorage.removeItem("superAdminEmail");
    setToken(null);
    setUser(null);
  };

  return (
    <SuperAdminContext.Provider
      value={{ user, token, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdminAuth() {
  const context = React.useContext(SuperAdminContext);
  if (!context) {
    throw new Error(
      "useSuperAdminAuth deve ser usado dentro de SuperAdminProvider"
    );
  }
  return context;
}
