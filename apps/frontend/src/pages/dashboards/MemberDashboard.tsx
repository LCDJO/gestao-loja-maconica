import { useMemberAuth } from '@/contexts/MemberAuthContext';
import MemberPortalLayout from '@/components/layout/MemberPortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react';
import { billingStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Bill } from '@/lib/types';

export default function MemberDashboard() {
  const { currentMember } = useMemberAuth();
  const [memberBills, setMemberBills] = useState<Bill[]>([]);

  useEffect(() => {
    if (currentMember) {
      const allBills = billingStore.getBills();
      const filtered = allBills.filter(b => b.memberId === currentMember.id);
      setMemberBills(filtered);
    }
  }, [currentMember]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const pendingBills = memberBills.filter(b => b.status === 'pending');
  const paidBills = memberBills.filter(b => b.status === 'paid');
  const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <MemberPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Bem-vindo, {currentMember?.name}</h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Grau: <span className="capitalize font-medium">{currentMember?.degree}</span>
          </p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={pendingBills.length > 0 ? 'bg-red-50/50 border-red-100' : 'bg-green-50/50 border-green-100'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendências</CardTitle>
              {pendingBills.length > 0 ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${pendingBills.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {pendingBills.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingBills.length === 0 ? 'Nenhuma pendência' : 'Cobranças aguardando pagamento'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(totalPending)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Valor total pendente</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{paidBills.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Cobranças quitadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Pendências */}
        {pendingBills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Próximas Pendências</CardTitle>
              <CardDescription>Clique em uma cobrança para gerar segunda via</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingBills.slice(0, 3).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5">
                    <div>
                      <p className="font-medium text-foreground">Cobrança Pendente</p>
                      <p className="text-sm text-muted-foreground">
                        Vence em {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(bill.amount)}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Segunda Via
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico Recente */}
        {paidBills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Últimos Pagamentos</CardTitle>
              <CardDescription>Histórico dos últimos 5 pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paidBills.slice(-5).reverse().map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground">Pagamento Realizado</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bill.paymentDate || '').toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(bill.amount)}</p>
                      <Badge className="bg-green-600 mt-1">Pago</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {memberBills.length === 0 && (
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="font-medium text-blue-900">Nenhuma cobrança registrada</p>
              <p className="text-sm text-blue-700 mt-1">
                Você não possui pendências ou cobranças registradas no sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MemberPortalLayout>
  );
}
