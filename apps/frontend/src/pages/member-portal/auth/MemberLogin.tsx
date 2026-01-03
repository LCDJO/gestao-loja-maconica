import { useState, useEffect } from "react";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useMemberAuth } from "@/contexts/MemberAuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function MemberLogin() {
  const [, setLocation] = useLocation();
  const { login: authLogin, isLoading: authLoading } = useMemberAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<{
    background: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundAttachment?: string;
  }>({
    background: "linear-gradient(to bottom right, #2563EB, #1E40AF)",
  });

  // Detectar se está em localhost
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Carregar configuração de background ao montar o componente
  useEffect(() => {
    try {
      const savedBg = localStorage.getItem("memberLoginBackground");
      if (savedBg) {
        const bgConfig = JSON.parse(savedBg);
        setBackgroundStyle(bgConfig);
      }
    } catch (err) {
      console.error("Erro ao carregar background:", err);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Em desenvolvimento (localhost), permitir login sem validação de credenciais
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        // Bypass para desenvolvimento: login automático sem validação
        const testUser = {
          id: 'dev-test-user',
          name: 'Usuário Teste',
          email: formData.email || 'joao@masonica.org',
          phone: '(11) 98765-4321',
          birthDate: '1980-01-01',
          cpf: '123.456.789-00',
          address: 'Rua de Teste, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          cim: '0001',
          degree: 'mestre' as const,
          status: 'ativo' as const,
          initiationDate: '2020-01-01',
          photoUrl: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Simular armazenamento de token e perfil
        localStorage.setItem('memberToken', 'dev-test-token-' + Date.now());
        localStorage.setItem('memberRefreshToken', 'dev-test-refresh-' + Date.now());
        localStorage.setItem('memberProfile', JSON.stringify(testUser));

        console.log('✅ Login de desenvolvimento (localhost) - Credenciais não validadas');
        
        // Redirecionar para dashboard
        setLocation("/member-portal/dashboard");
        return;
      }

      // Em produção, fazer login real com API
      // Validação básica
      if (!formData.email || !formData.password) {
        setError("Email e senha são obrigatórios");
        setIsLoading(false);
        return;
      }

      // Fazer login real com API
      const success = await authLogin(formData.email, formData.password);

      if (success) {
        // Redirecionar para dashboard
        setLocation("/member-portal/dashboard");
      } else {
        // Erro já foi capturado no contexto, apenas manter a mensagem genérica
        setError("Email ou senha incorretos");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || authLoading;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={backgroundStyle}
    >
      {/* Container Responsivo */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Card className="shadow-lg sm:shadow-xl">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <User className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-blue-600" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Portal do Irmão</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                Acesse sua conta pessoal
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 sm:gap-3">
                <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Conteúdo diferente para localhost vs produção */}
            {isLocalhost ? (
              <>
                {/* Badge de Modo Desenvolvimento */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-2">🚀 Modo Desenvolvimento</p>
                  <p className="text-xs text-green-800 mb-4">
                    Você está em <strong>localhost</strong>. Autenticação desativada para desenvolvimento.
                  </p>
                  <p className="text-xs text-green-700">
                    Clique em "Entrar" para acessar como usuário de teste.
                  </p>
                </div>

                {/* Botão de Login Simplificado */}
                <form onSubmit={handleSubmit}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    <LogIn className="w-4 h-4" />
                    {isSubmitting ? "Entrando..." : "Entrar como Usuário de Teste"}
                  </Button>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-2 sm:gap-3">
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">
                        Desenvolvimento Local
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Em produção, você precisará de email e senha válidos
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Info de Teste */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1 sm:mb-2">📝 Dados de Teste (Pré-preenchidos)</p>
                  <ul className="text-xs text-amber-800 space-y-0.5 sm:space-y-1">
                    <li>• Email: joao@masonica.org</li>
                    <li>• Senha: senha123456</li>
                  </ul>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded mr-2"
                        disabled={isSubmitting}
                      />
                      <span className="text-gray-600">Lembrar-me</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:underline whitespace-nowrap">
                      Esqueceu a senha?
                    </a>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    <LogIn className="w-4 h-4" />
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                {/* Footer */}
                <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
                  <p>
                    Não tem acesso?{" "}
                    <a href="/" className="text-blue-600 hover:underline">
                      Voltar ao início
                    </a>
                  </p>
                </div>

                {/* Info Box */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-2 sm:gap-3">
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">
                        Conexão Segura
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">
                        Seus dados são criptografados com JWT
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Status */}
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 overflow-x-auto">
                  <p className="font-mono text-xs break-all">🔗 API: http://localhost:3002/api/members</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
