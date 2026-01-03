import { useState, useRef } from "react";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Link2,
  Unlink,
  Download,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { parseOFX, calculateSimilarity } from "@/lib/ofxParser";
import {
  reconciliationStore,
  billingStore,
  memberStore,
} from "@/lib/store";
import {
  OFXTransaction,
  BankReconciliation,
  ReconciliationMatch,
  Bill,
} from "@/lib/types";

export default function Conciliacao() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>(
    reconciliationStore.getReconciliations()
  );
  const [selectedReconciliation, setSelectedReconciliation] =
    useState<BankReconciliation | null>(null);
  const [matches, setMatches] = useState<ReconciliationMatch[]>(
    reconciliationStore.getMatches()
  );
  const [pendingMatches, setPendingMatches] = useState<ReconciliationMatch[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { transactions, bankName, accountNumber } = parseOFX(content);

        if (transactions.length === 0) {
          toast.error("Nenhuma transação encontrada no arquivo OFX");
          return;
        }

        // Criar novo registro de conciliação
        const reconciliation = reconciliationStore.addReconciliation({
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          bankName,
          accountNumber,
          transactions,
          status: "pending",
          matchedBills: [],
        });

        setReconciliations(reconciliationStore.getReconciliations());
        setSelectedReconciliation(reconciliation);
        toast.success(
          `${transactions.length} transações importadas com sucesso`
        );

        // Executar matching automático
        performAutoMatching(reconciliation);
      } catch (error) {
        toast.error("Erro ao processar arquivo OFX");
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  const performAutoMatching = (reconciliation: BankReconciliation) => {
    const bills = billingStore.getBills();
    const newMatches: ReconciliationMatch[] = [];

    for (const transaction of reconciliation.transactions) {
      // Filtrar cobranças pendentes com valor similar
      const candidates = bills.filter(
        (b) =>
          b.status === "pending" &&
          Math.abs(b.amount - transaction.amount) < 0.01
      );

      if (candidates.length > 0) {
        // Se houver apenas uma candidata com valor exato, fazer match automático
        if (candidates.length === 1) {
          newMatches.push({
            ofxTransactionId: transaction.id,
            billId: candidates[0].id,
            confidence: 100,
            matchType: "exact",
          });
        } else {
          // Se houver múltiplas candidatas, usar fuzzy matching na descrição
          let bestMatch = candidates[0];
          let bestScore = 0;

          for (const candidate of candidates) {
            const member = memberStore.getAll().find((m) => m.id === candidate.memberId);
            if (member) {
              const similarity = calculateSimilarity(
                transaction.description,
                member.name
              );
              if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = candidate;
              }
            }
          }

          if (bestScore > 40) {
            newMatches.push({
              ofxTransactionId: transaction.id,
              billId: bestMatch.id,
              confidence: Math.round(bestScore),
              matchType: "fuzzy",
            });
          }
        }
      }
    }

    setPendingMatches(newMatches);
    toast.success(`${newMatches.length} correspondências automáticas encontradas`);
  };

  const handleConfirmMatches = () => {
    if (pendingMatches.length === 0) {
      toast.error("Nenhuma correspondência para confirmar");
      return;
    }

    setIsProcessing(true);

    // Simular processamento
    setTimeout(() => {
      // Aplicar os matches
      const allMatches = [...matches, ...pendingMatches];
      reconciliationStore.saveMatches(allMatches);
      setMatches(allMatches);

      // Dar baixa nas cobranças
      for (const match of pendingMatches) {
        billingStore.updateBill(match.billId, {
          status: "paid",
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: "pix",
        });
      }

      // Atualizar status da conciliação
      if (selectedReconciliation) {
        const updated = reconciliationStore.updateReconciliation(
          selectedReconciliation.id,
          {
            status: "completed",
            matchedBills: pendingMatches.map((m) => m.billId),
          }
        );
        if (updated) {
          setSelectedReconciliation(updated);
        }
      }

      setReconciliations(reconciliationStore.getReconciliations());
      setPendingMatches([]);
      setIsProcessing(false);

      toast.success(
        `${pendingMatches.length} cobranças baixadas automaticamente`
      );
    }, 1500);
  };

  const handleManualMatch = (
    transactionId: string,
    billId: string,
    confidence: number
  ) => {
    const newMatch: ReconciliationMatch = {
      ofxTransactionId: transactionId,
      billId,
      confidence,
      matchType: "manual",
    };

    setPendingMatches((prev) => [
      ...prev.filter((m) => m.ofxTransactionId !== transactionId),
      newMatch,
    ]);
    toast.success("Correspondência manual registrada");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const bills = billingStore.getBills();
  const members = memberStore.getAll();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              Conciliação Bancária
            </h1>
            <p className="text-muted-foreground font-serif italic">
              Importe arquivos OFX e dê baixa automática nas cobranças.
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 bg-primary text-primary-foreground"
          >
            <Upload className="h-4 w-4" /> Importar OFX
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ofx,.txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <Tabs defaultValue="historico" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="historico">Histórico de Conciliações</TabsTrigger>
            <TabsTrigger value="detalhes" disabled={!selectedReconciliation}>
              Detalhes da Conciliação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conciliações Realizadas</CardTitle>
                <CardDescription>
                  Clique em uma conciliação para ver os detalhes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reconciliations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                      Nenhuma conciliação realizada. Importe um arquivo OFX
                      para começar.
                    </div>
                  ) : (
                    reconciliations.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedReconciliation(rec)}
                        className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">
                                {rec.fileName}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{rec.bankName}</span>
                                <span>•</span>
                                <span>
                                  {rec.transactions.length} transações
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(rec.uploadDate).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold">
                                {formatCurrency(
                                  rec.transactions.reduce(
                                    (sum, t) => sum + t.amount,
                                    0
                                  )
                                )}
                              </div>
                              <Badge
                                variant={
                                  rec.status === "completed"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  rec.status === "completed"
                                    ? "bg-green-600"
                                    : ""
                                }
                              >
                                {rec.status === "completed"
                                  ? "Concluída"
                                  : "Pendente"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-4">
            {selectedReconciliation && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedReconciliation.fileName}</CardTitle>
                    <CardDescription>
                      {selectedReconciliation.bankName} •{" "}
                      {selectedReconciliation.accountNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">
                          Total Importado
                        </div>
                        <div className="text-2xl font-bold text-blue-700 mt-1">
                          {formatCurrency(
                            selectedReconciliation.transactions.reduce(
                              (sum, t) => sum + t.amount,
                              0
                            )
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50/50 border border-green-100 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">
                          Correspondências Encontradas
                        </div>
                        <div className="text-2xl font-bold text-green-700 mt-1">
                          {pendingMatches.length}
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <div className="text-sm text-amber-600 font-medium">
                          Sem Correspondência
                        </div>
                        <div className="text-2xl font-bold text-amber-700 mt-1">
                          {
                            selectedReconciliation.transactions.filter(
                              (t) =>
                                !pendingMatches.find(
                                  (m) => m.ofxTransactionId === t.id
                                )
                            ).length
                          }
                        </div>
                      </div>
                    </div>

                    {pendingMatches.length > 0 && (
                      <Button
                        onClick={handleConfirmMatches}
                        disabled={isProcessing}
                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isProcessing
                          ? "Processando..."
                          : `Confirmar ${pendingMatches.length} Baixas`}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transações Importadas</CardTitle>
                    <CardDescription>
                      Revise as correspondências automáticas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedReconciliation.transactions.map((transaction) => {
                        const match = pendingMatches.find(
                          (m) => m.ofxTransactionId === transaction.id
                        );
                        const matchedBill = match
                          ? bills.find((b) => b.id === match.billId)
                          : null;
                        const matchedMember = matchedBill
                          ? members.find((m) => m.id === matchedBill.memberId)
                          : null;

                        return (
                          <div
                            key={transaction.id}
                            className="p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-foreground">
                                  {transaction.description}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(transaction.date).toLocaleDateString(
                                    "pt-BR"
                                  )}{" "}
                                  • {formatCurrency(transaction.amount)}
                                </p>
                              </div>
                              {match && (
                                <Badge className="bg-green-600">
                                  Correspondido
                                </Badge>
                              )}
                            </div>

                            {match && matchedMember && (
                              <div className="p-3 bg-green-50/50 border border-green-100 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-green-700">
                                      {matchedMember.name}
                                    </p>
                                    <p className="text-xs text-green-600">
                                      Confiança: {match.confidence}%
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setPendingMatches((prev) =>
                                        prev.filter(
                                          (m) =>
                                            m.ofxTransactionId !==
                                            transaction.id
                                        )
                                      );
                                    }}
                                  >
                                    <Unlink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {!match && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full gap-2"
                                  >
                                    <Link2 className="h-4 w-4" /> Associar
                                    Manualmente
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Associar Transação
                                    </DialogTitle>
                                    <DialogDescription>
                                      Selecione a cobrança correspondente
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm font-medium">
                                        {transaction.description}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatCurrency(transaction.amount)}
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Selecione a Cobrança</Label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Escolha uma cobrança pendente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {bills
                                            .filter((b) => b.status === "pending")
                                            .map((bill) => {
                                              const member = members.find(
                                                (m) => m.id === bill.memberId
                                              );
                                              return (
                                                <SelectItem
                                                  key={bill.id}
                                                  value={bill.id}
                                                >
                                                  {member?.name} -{" "}
                                                  {formatCurrency(bill.amount)}
                                                </SelectItem>
                                              );
                                            })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={(e) => {
                                        const select = (
                                          e.currentTarget.parentElement
                                            ?.previousElementSibling
                                            ?.querySelector("button") as HTMLButtonElement
                                        )?.click?.();
                                        toast.success(
                                          "Associação registrada"
                                        );
                                      }}
                                    >
                                      Associar
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
