import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

export default function SuperAdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('admin@sistema.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular autenticação
      if (email === 'admin@sistema.com' && password === 'admin123') {
        localStorage.setItem('superAdminToken', JSON.stringify({
          email,
          role: 'super_admin',
          loginTime: new Date().toISOString(),
        }));
        toast.success('Login realizado com sucesso!');
        setLocation('/super-admin/dashboard');
      } else {
        toast.error('Email ou senha incorretos');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
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

        {/* Login Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle>Acesso Super Administrador</CardTitle>
            <CardDescription>
              Faça login para gerenciar todas as lojas e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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

            {/* Footer */}
            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Sistema de Gestão de Lojas Maçônicas</p>
              <p className="text-xs mt-1">Versão 1.0.0 - Todos os direitos reservados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
