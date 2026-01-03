import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMemberAuth } from '@/contexts/MemberAuthContext';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useMemberAuth();
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      if (login(email, password)) {
        toast.success('Login realizado com sucesso!');
        navigate('/membro/dashboard');
      } else {
        setError('Email ou senha incorretos. Use email@example.com e senha 123456 para teste.');
        toast.error('Falha na autenticação');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">Portal do Irmão</h1>
          <p className="text-muted-foreground font-serif italic">
            Acesse suas pendências e documentos de cobrança
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Autenticação</CardTitle>
            <CardDescription>
              Faça login com seu email cadastrado na loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-blue-900 mb-2">Credenciais de Teste:</p>
            <div className="space-y-1 text-xs text-blue-800 font-mono">
              <p>Email: <span className="font-bold">joao.silva@example.com</span></p>
              <p>Senha: <span className="font-bold">123456</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Sistema de Gestão de Lojas Maçônicas • Portal do Membro
        </p>
      </div>
    </div>
  );
}
