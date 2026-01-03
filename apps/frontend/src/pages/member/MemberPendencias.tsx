import { useMemberAuth } from '@/contexts/MemberAuthContext';
import MemberPortalLayout from '@/components/layout/MemberPortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Download, Copy, Mail, MessageCircle, QrCode } from 'lucide-react';
import { billingStore, configStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Bill } from '@/lib/types';
import { toast } from 'sonner';

export default function MemberPendencias() {
  const { currentMember } = useMemberAuth();
  const [memberBills, setMemberBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentMember) {
      const allBills = billingStore.getBills();
      const filtered = allBills.filter(b => b.memberId === currentMember.id && b.status === 'pending');
      setMemberBills(filtered);
    }
  }, [currentMember]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const generatePixCode = (bill: Bill): string => {
    // Simulação de código PIX (em produção, usar biblioteca como brcode)
    const config = configStore.get();
    return `00020126580014br.gov.bcb.pix0136${config.paymentMethods.pix.key}5204000053039865802BR5913${currentMember?.name}6009SAO PAULO62410503***63041D3D`;
  };

  const generateBoletoCode = (bill: Bill): string => {
    // Simulação de código de barras do boleto
    return `${Math.random().toString().substring(2, 29)}.${Math.random().toString().substring(2, 9)} ${Math.random().toString().substring(2, 9)}.${Math.random().toString().substring(2, 9)}`;
  };

  const handleDownloadPix = (bill: Bill) => {
    setIsGenerating(true);
    setTimeout(() => {
      const pixCode = generatePixCode(bill);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pixCode));
      element.setAttribute('download', `pix-${bill.id}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Código PIX baixado');
      setIsGenerating(false);
    }, 800);
  };

  const handleDownloadBoleto = (bill: Bill) => {
    setIsGenerating(true);
    setTimeout(() => {
      const boletoCode = generateBoletoCode(bill);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(boletoCode));
      element.setAttribute('download', `boleto-${bill.id}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Boleto baixado');
      setIsGenerating(false);
    }, 800);
  };

  const handleCopyPix = (bill: Bill) => {
    const pixCode = generatePixCode(bill);
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado para área de transferência');
  };

  const handleSendWhatsapp = (bill: Bill) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Enviando para WhatsApp...',
        success: 'Código enviado com sucesso',
        error: 'Erro ao enviar',
      }
    );
  };

  const handleSendEmail = (bill: Bill) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Enviando para email...',
        success: 'Email enviado com sucesso',
        error: 'Erro ao enviar',
      }
    );
  };

  return (
    <MemberPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Minhas Pendências</h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Visualize e gere segunda via de suas cobranças
          </p>
        </div>

        {memberBills.length === 0 ? (
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-4">✓</div>
              <p className="font-medium text-green-900">Nenhuma pendência!</p>
              <p className="text-sm text-green-700 mt-1">
                Você está em dia com todas as suas obrigações financeiras.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {memberBills.map((bill) => (
              <Card key={bill.id} className="border-amber-100 bg-amber-50/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-foreground">Cobrança Pendente</h3>
                        <Badge variant="outline" className="border-amber-200 text-amber-700">
                          Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">{formatCurrency(bill.amount)}</p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedBill(bill)}
                          className="gap-2 bg-primary text-primary-foreground"
                        >
                          <Download className="h-4 w-4" />
                          Segunda Via
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Segunda Via de Cobrança</DialogTitle>
                          <DialogDescription>
                            Valor: {formatCurrency(bill.amount)} • Vencimento:{' '}
                            {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          {/* PIX */}
                          <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <QrCode className="h-5 w-5 text-primary" />
                              <h4 className="font-bold text-foreground">Pagamento via PIX</h4>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <p className="text-xs text-muted-foreground">Código PIX (Copia e Cola):</p>
                              <div className="flex gap-2">
                                <code className="flex-1 text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                  {generatePixCode(bill).substring(0, 50)}...
                                </code>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCopyPix(bill)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => handleDownloadPix(bill)}
                                disabled={isGenerating}
                              >
                                <Download className="h-4 w-4" />
                                Baixar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => handleSendWhatsapp(bill)}
                              >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => handleSendEmail(bill)}
                              >
                                <Mail className="h-4 w-4" />
                                Email
                              </Button>
                            </div>
                          </div>

                          {/* Boleto */}
                          <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <QrCode className="h-5 w-5 text-primary" />
                              <h4 className="font-bold text-foreground">Pagamento via Boleto</h4>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <p className="text-xs text-muted-foreground">Código de Barras:</p>
                              <code className="text-sm bg-white p-2 rounded border border-gray-200 block font-mono">
                                {generateBoletoCode(bill)}
                              </code>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => handleDownloadBoleto(bill)}
                                disabled={isGenerating}
                              >
                                <Download className="h-4 w-4" />
                                Baixar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => handleSendEmail(bill)}
                              >
                                <Mail className="h-4 w-4" />
                                Email
                              </Button>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                            <p className="font-medium mb-1">💡 Dica:</p>
                            <p>
                              Você pode copiar o código PIX e colar direto no seu app bancário, ou baixar o boleto para pagar em qualquer banco.
                            </p>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline">Fechar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
}
