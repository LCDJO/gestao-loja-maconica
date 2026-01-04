import { useState, useEffect } from "react";
import { useAdminAuth } from "@/contexts/AdminContext";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [lodges, setLodges] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedLodge, setSelectedLodge] = useState("lodge-1");
  const [email, setEmail] = useState("admin@loja.masonica.org");
  const [password, setPassword] = useState("senha123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const { login } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Mock de lojas disponíveis
    // TODO: Fazer request real para API de super-admin
    setLodges([
      { id: "lodge-1", name: "Loja Principal" },
      { id: "lodge-2", name: "Loja Secundária" },
      { id: "lodge-3", name: "Loja Filial" },
    ]);
  }, []);

  useEffect(() => {
    // Auto-login em localhost para desenvolvimento
    const localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setIsLocalhost(localhost);
    
    if (localhost) {
      const autoLogin = async () => {
        try {
          setLoading(true);
          await login("admin@loja.masonica.org", "senha123456", "lodge-1");
          navigate("/admin/dashboard");
        } catch (err) {
          console.error("Auto-login failed:", err);
          setLoading(false);
          setIsLocalhost(false);
        }
      };
      // Pequeno delay para garantir que o componente está renderizado
      setTimeout(autoLogin, 100);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError("");

    const lodgeToUse = selectedLodge.trim() || "lodge-1";
    const emailToUse = email.trim() || "admin@loja.masonica.org";
    const passwordToUse = password.trim() || "senha123456";

    try {
      await login(emailToUse, passwordToUse, lodgeToUse);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Admin</h1>
          <p className="text-gray-600 text-sm mt-2">
            Painel Administrativo da Loja
          </p>
        </div>

        {isLocalhost && loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 font-semibold">Entrando automaticamente...</p>
            <p className="text-gray-500 text-sm">localhost - modo desenvolvimento</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Loja
              </label>
              <select
                value={selectedLodge}
                onChange={(e) => setSelectedLodge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Selecione sua loja --</option>
                {lodges.map((lodge) => (
                  <option key={lodge.id} value={lodge.id}>
                    {lodge.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                E-mail
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@loja.masonica.org"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-xs">
            <strong>Demo:</strong> admin@loja.masonica.org / senha123456
          </p>
        </div>
      </div>
    </div>
  );
}
