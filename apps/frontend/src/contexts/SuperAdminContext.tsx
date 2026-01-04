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
  isInitialized: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  // Validar token com backend
  const validateTokenWithBackend = async (storedToken: string) => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/auth/super-admin/profile",
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
      localStorage.removeItem("superAdminToken");
      localStorage.removeItem("superAdminRefreshToken");
      return false;
    }
  };

  // Restaurar sessão ao inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem("superAdminToken");
    
    if (storedToken) {
      validateTokenWithBackend(storedToken);
    }
    
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
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
      setToken(data.data.token);
      setUser(data.data.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdminRefreshToken");
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <SuperAdminContext.Provider
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
