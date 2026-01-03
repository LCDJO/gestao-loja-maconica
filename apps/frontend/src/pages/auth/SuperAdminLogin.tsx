import { useState, FC, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

/**
 * Schema de validação para login do Super Admin
 * Valida email e senha com regras específicas
 */
const superAdminLoginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
});

type SuperAdminLoginInput = z.infer<typeof superAdminLoginSchema>;

/**
 * Componente para o formulário de modo desenvolvimento
 */
interface DevelopmentLoginFormProps {
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}

const DevelopmentLoginForm: FC<DevelopmentLoginFormProps> = ({ loading, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="font-semibold text-green-900 mb-2">🚀 Modo Desenvolvimento</p>
      <p className="text-sm text-green-800 mb-4">
        Você está em <strong>localhost</strong>. Clique em "Acessar Painel" para entrar como administrador de teste.
      </p>
    </div>

    <Button
      type="submit"
      className="w-full bg-primary text-primary-foreground"
      disabled={loading}
    >
      {loading ? 'Autenticando...' : 'Acessar Painel'}
    </Button>
  </form>
);

/**
 * Componente para o formulário de modo produção
 */
interface ProductionLoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}

const ProductionLoginForm: FC<ProductionLoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {/* Email */}
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="admin@sistema.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
          aria-label="Email de administrador"
        />
      </div>
    </div>

    {/* Password */}
    <div className="space-y-2">
      <Label htmlFor="password">Senha</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10"
          required
          aria-label="Senha do administrador"
        />
      </div>
    </div>

    {/* Demo Info */}
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <p className="font-semibold text-blue-900 mb-1">Credenciais de Demonstração:</p>
      <p className="text-blue-800">Email: admin@sistema.com</p>
      <p className="text-blue-800">Senha: admin123</p>
    </div>

    {/* Submit Button */}
    <Button
      type="submit"
      className="w-full bg-primary text-primary-foreground"
      disabled={loading}
    >
      {loading ? 'Autenticando...' : 'Acessar Painel'}
    </Button>
  </form>
);

/**
 * Componente de header do login
 */
const LoginHeader: FC = () => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm mb-4">
      <Lock className="h-8 w-8 text-white" />
    </div>
    <h1 className="text-3xl font-bold text-white font-display">
      G.O.D.F.
    </h1>
    <p className="text-blue-100 mt-2 font-serif italic">
      Painel de Administração do Sistema
    </p>
  </div>
);

/**
 * Componente de footer do login
 */
const LoginFooter: FC = () => (
  <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
    <p>Sistema de Gestão de Lojas Maçônicas</p>
    <p className="text-xs mt-1">Versão 1.0.0 - Todos os direitos reservados</p>
  </div>
);

/**
 * Componente principal de login do Super Admin
 */
const SuperAdminLogin: FC = () => {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Detectar se está em localhost
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ VALIDAR INPUT COM ZOD
      const validation = superAdminLoginSchema.safeParse({ email, password });
      
      if (!validation.success) {
        const error = validation.error.issues[0];
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const { email: validEmail, password: validPassword } = validation.data;

      // Em desenvolvimento (localhost), permitir login sem validação
      if (isLocalhost) {
        localStorage.setItem('superAdminToken', JSON.stringify({
          email: 'admin@sistema.com',
          role: 'super_admin',
          loginTime: new Date().toISOString(),
        }));
        toast.success('✅ Acesso de Desenvolvimento');
        setLocation('/super-admin/dashboard');
        return;
      }

      // Em produção, validar credenciais
      if (validEmail === 'admin@sistema.com' && validPassword === 'admin123') {
        localStorage.setItem('superAdminToken', JSON.stringify({
          email: validEmail,
          role: 'super_admin',
          loginTime: new Date().toISOString(),
        }));
        toast.success('Login realizado com sucesso!');
        setLocation('/super-admin/dashboard');
      } else {
        toast.error('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <LoginHeader />

        {/* Login Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle>Acesso Super Administrador</CardTitle>
            <CardDescription>
              Faça login para gerenciar todas as lojas e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Renderizar formulário apropriado */}
            {isLocalhost ? (
              <DevelopmentLoginForm loading={loading} onSubmit={handleLogin} />
            ) : (
              <ProductionLoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                onSubmit={handleLogin}
              />
            )}

            {/* Footer */}
            <LoginFooter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
