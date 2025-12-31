import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Wallet,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { memberStore, transactionStore, feeStore } from "@/lib/store";
import { Member, Transaction, MonthlyFee, TransactionType, TransactionCategory } from "@/lib/types";

export default function Tesouraria() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [balance, setBalance] = useState(0);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [memberFees, setMemberFees] = useState<MonthlyFee[]>([]);
  
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'receita',
    category: 'outros'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTransactions = transactionStore.getAll();
    setTransactions(allTransactions);
    setBalance(transactionStore.getBalance());
    setMembers(memberStore.getAll());
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.date) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    transactionStore.add(newTransaction as Transaction);
    toast.success("Transação registrada com sucesso");
    setIsAddTransactionOpen(false);
    setNewTransaction({ type: 'receita', category: 'outros' });
    loadData();
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    let fees = feeStore.getByMember(memberId);
    
    // Se não tiver mensalidades geradas, gera para o ano atual
    if (fees.length === 0) {
      fees = feeStore.generateForYear(memberId, new Date().getFullYear(), 150.00);
    }
    setMemberFees(fees);
  };

  const handlePayFee = (fee: MonthlyFee) => {
    const updatedFees = memberFees.map(f => 
      f.id === fee.id ? { ...f, status: 'pago' as const, paymentDate: new Date().toISOString().split('T')[0] } : f
    );
    setMemberFees(updatedFees);
    feeStore.save(selectedMemberId, updatedFees);
    
    // Registrar transação automaticamente
    transactionStore.add({
      date: new Date().toISOString().split('T')[0],
      type: 'receita',
      category: 'mensalidade',
      description: `Mensalidade ${fee.month}/${fee.year} - ${members.find(m => m.id === selectedMemberId)?.name}`,
      amount: fee.amount,
      memberId: selectedMemberId
    });
    
    toast.success("Mensalidade paga e registrada no caixa");
    loadData();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'receita')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const expense = monthlyTransactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { income, expense };
  };

  const monthlyStats = getMonthlyStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Tesouraria</h1>
            <p className="text-muted-foreground font-serif italic">Gestão financeira e mensalidades.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4" /> Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Movimentação</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={newTransaction.type} onValueChange={(v: TransactionType) => setNewTransaction({...newTransaction, type: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receita">Receita</SelectItem>
                          <SelectItem value="despesa">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select value={newTransaction.category} onValueChange={(v: TransactionCategory) => setNewTransaction({...newTransaction, category: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mensalidade">Mensalidade</SelectItem>
                          <SelectItem value="tronco">Tronco</SelectItem>
                          <SelectItem value="aluguel">Aluguel</SelectItem>
                          <SelectItem value="agape">Ágape</SelectItem>
                          <SelectItem value="materiais">Materiais</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input value={newTransaction.description || ''} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" value={newTransaction.amount || ''} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={newTransaction.date || ''} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTransaction}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Saldo Atual</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary font-display">{formatCurrency(balance)}</div>
              <p className="text-xs text-muted-foreground mt-1">Posição consolidada</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyStats.income)}</div>
              <p className="text-xs text-muted-foreground">Entradas em {new Date().toLocaleString('pt-BR', { month: 'long' })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(monthlyStats.expense)}</div>
              <p className="text-xs text-muted-foreground">Saídas em {new Date().toLocaleString('pt-BR', { month: 'long' })}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fluxo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="mensalidades">Controle de Mensalidades</TabsTrigger>
          </TabsList>

          <TabsContent value="fluxo" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Movimentações Recentes</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice().reverse().map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {transaction.type === 'receita' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{transaction.description}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                            <span>•</span>
                            <span className="capitalize">{transaction.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-right font-bold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma transação registrada.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensalidades" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Selecionar Irmão</CardTitle>
                  <CardDescription>Escolha um membro para ver o histórico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Select value={selectedMemberId} onValueChange={handleMemberSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um membro" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedMemberId && (
                      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <h4 className="font-bold text-primary mb-2">Resumo Anual</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Pagas:</span>
                            <span className="font-medium text-green-600">
                              {memberFees.filter(f => f.status === 'pago').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pendentes:</span>
                            <span className="font-medium text-amber-600">
                              {memberFees.filter(f => f.status === 'pendente').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Atrasadas:</span>
                            <span className="font-medium text-red-600">
                              {memberFees.filter(f => f.status === 'atrasado').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Histórico de Mensalidades ({new Date().getFullYear()})</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedMemberId ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Selecione um membro para visualizar as mensalidades.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {memberFees.map((fee) => (
                        <div 
                          key={fee.id} 
                          className={`p-4 border rounded-lg flex flex-col justify-between gap-3 ${
                            fee.status === 'pago' ? 'bg-green-50/50 border-green-200' : 
                            fee.status === 'atrasado' ? 'bg-red-50/50 border-red-200' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-sm font-bold uppercase text-muted-foreground">
                                {new Date(0, fee.month - 1).toLocaleString('pt-BR', { month: 'long' })}
                              </span>
                              <div className="font-bold text-lg">{formatCurrency(fee.amount)}</div>
                            </div>
                            {fee.status === 'pago' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : fee.status === 'atrasado' ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                            )}
                          </div>
                          
                          {fee.status === 'pago' ? (
                            <div className="text-xs text-green-700 font-medium">
                              Pago em {new Date(fee.paymentDate!).toLocaleDateString('pt-BR')}
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              className="w-full" 
                              variant={fee.status === 'atrasado' ? 'destructive' : 'default'}
                              onClick={() => handlePayFee(fee)}
                            >
                              Registrar Pagamento
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
