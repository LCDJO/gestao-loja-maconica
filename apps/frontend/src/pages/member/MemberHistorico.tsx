import { useMemberAuth } from '@/contexts/MemberAuthContext';
import MemberPortalLayout from '@/components/layout/MemberPortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { billingStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Bill } from '@/lib/types';

export default function MemberHistorico() {
  const { currentMember } = useMemberAuth();
  const [memberBills, setMemberBills] = useState<Bill[]>([]);

  useEffect(() => {
    if (currentMember) {
      const allBills = billingStore.getBills();
      const filtered = allBills.filter(b => b.memberId === currentMember.id);
      setMemberBills(filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));
    }
  }, [currentMember]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (bill: Bill) => {
    if (bill.status === 'paid') {
      return (
        <Badge className="bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Pago
        </Badge>
      );
    }

    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today;

    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Atrasado
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        <Clock className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    );
  };

  const getStatusIcon = (bill: Bill) => {
    if (bill.status === 'paid') {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }

    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today;

    if (isOverdue) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }

    return <Clock className="h-5 w-5 text-amber-600" />;
  };

  const paidBills = memberBills.filter(b => b.status === 'paid');
  const pendingBills = memberBills.filter(b => b.status === 'pending');
  const totalPaid = paidBills.reduce((sum, b) => sum + b.amount, 0);
  const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <MemberPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Histórico de Pagamentos</h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Acompanhe todas as suas transações financeiras
          </p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-green-50/50 border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">{paidBills.length} pagamentos realizados</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingBills.length} cobranças pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Transações</CardTitle>
            <CardDescription>Histórico completo de cobranças e pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            {memberBills.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma transação registrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberBills.map((bill) => (
                  <div
                    key={bill.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      bill.status === 'paid'
                        ? 'bg-green-50/30 border-green-100'
                        : 'bg-amber-50/30 border-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(bill)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground capitalize">
                          Cobrança Pendente
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bill.status === 'paid'
                            ? `Pago em ${new Date(bill.paymentDate || '').toLocaleDateString('pt-BR')}`
                            : `Vencimento: ${new Date(bill.dueDate).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold text-lg ${bill.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {formatCurrency(bill.amount)}
                      </p>
                      <div className="mt-2">{getStatusBadge(bill)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {memberBills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Taxa de Pagamento</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {Math.round((paidBills.length / memberBills.length) * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Média de Pagamento</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {paidBills.length > 0 ? formatCurrency(totalPaid / paidBills.length) : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Total de Transações</p>
                  <p className="text-2xl font-bold text-primary mt-1">{memberBills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MemberPortalLayout>
  );
}
