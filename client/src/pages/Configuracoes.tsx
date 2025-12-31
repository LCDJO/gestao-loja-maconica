import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, Server, CreditCard, QrCode, FileText } from "lucide-react";
import { toast } from "sonner";
import { configStore } from "@/lib/store";
import { AppConfig } from "@/lib/types";

export default function Configuracoes() {
  const [config, setConfig] = useState<AppConfig>(configStore.get());

  const handleSave = () => {
    configStore.save(config);
    toast.success("Configurações salvas com sucesso");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Configurações</h1>
            <p className="text-muted-foreground font-serif italic">Integrações e formas de pagamento.</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Salvar Alterações
          </Button>
        </div>

        <Tabs defaultValue="integracoes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="integracoes">Integrações (API)</TabsTrigger>
            <TabsTrigger value="pagamentos">Formas de Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="integracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>Evolution API (WhatsApp)</CardTitle>
                </div>
                <CardDescription>Configuração para envio de mensagens automáticas via WhatsApp.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="evo-enabled">Habilitar Integração</Label>
                  <Switch 
                    id="evo-enabled" 
                    checked={config.integrations.evolutionApi.enabled}
                    onCheckedChange={(c) => setConfig({
                      ...config, 
                      integrations: { 
                        ...config.integrations, 
                        evolutionApi: { ...config.integrations.evolutionApi, enabled: c } 
                      }
                    })}
                  />
                </div>
                {config.integrations.evolutionApi.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Base URL</Label>
                      <Input 
                        placeholder="https://api.evolution.com" 
                        value={config.integrations.evolutionApi.baseUrl}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            evolutionApi: { ...config.integrations.evolutionApi, baseUrl: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input 
                        type="password" 
                        placeholder="Sua chave de API"
                        value={config.integrations.evolutionApi.apiKey}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            evolutionApi: { ...config.integrations.evolutionApi, apiKey: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instance Name</Label>
                      <Input 
                        placeholder="Nome da instância"
                        value={config.integrations.evolutionApi.instanceName}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            evolutionApi: { ...config.integrations.evolutionApi, instanceName: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>GOWA (WhatsApp)</CardTitle>
                </div>
                <CardDescription>Integração alternativa para WhatsApp.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gowa-enabled">Habilitar Integração</Label>
                  <Switch 
                    id="gowa-enabled" 
                    checked={config.integrations.gowa.enabled}
                    onCheckedChange={(c) => setConfig({
                      ...config, 
                      integrations: { 
                        ...config.integrations, 
                        gowa: { ...config.integrations.gowa, enabled: c } 
                      }
                    })}
                  />
                </div>
                {config.integrations.gowa.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Base URL</Label>
                      <Input 
                        placeholder="https://api.gowa.com" 
                        value={config.integrations.gowa.baseUrl}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            gowa: { ...config.integrations.gowa, baseUrl: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Token</Label>
                      <Input 
                        type="password" 
                        placeholder="Seu token de acesso"
                        value={config.integrations.gowa.token}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            gowa: { ...config.integrations.gowa, token: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <CardTitle>Configuração PIX</CardTitle>
                </div>
                <CardDescription>Dados para geração de QR Code e Chave PIX.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pix-enabled">Habilitar PIX</Label>
                  <Switch 
                    id="pix-enabled" 
                    checked={config.paymentMethods.pix.enabled}
                    onCheckedChange={(c) => setConfig({
                      ...config, 
                      paymentMethods: { 
                        ...config.paymentMethods, 
                        pix: { ...config.paymentMethods.pix, enabled: c } 
                      }
                    })}
                  />
                </div>
                {config.paymentMethods.pix.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Chave</Label>
                        <Select 
                          value={config.paymentMethods.pix.keyType}
                          onValueChange={(v: any) => setConfig({
                            ...config,
                            paymentMethods: {
                              ...config.paymentMethods,
                              pix: { ...config.paymentMethods.pix, keyType: v }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="cnpj">CNPJ</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                            <SelectItem value="random">Chave Aleatória</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Chave PIX</Label>
                        <Input 
                          value={config.paymentMethods.pix.key}
                          onChange={(e) => setConfig({
                            ...config,
                            paymentMethods: {
                              ...config.paymentMethods,
                              pix: { ...config.paymentMethods.pix, key: e.target.value }
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome do Beneficiário</Label>
                        <Input 
                          value={config.paymentMethods.pix.merchantName}
                          onChange={(e) => setConfig({
                            ...config,
                            paymentMethods: {
                              ...config.paymentMethods,
                              pix: { ...config.paymentMethods.pix, merchantName: e.target.value }
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cidade do Beneficiário</Label>
                        <Input 
                          value={config.paymentMethods.pix.merchantCity}
                          onChange={(e) => setConfig({
                            ...config,
                            paymentMethods: {
                              ...config.paymentMethods,
                              pix: { ...config.paymentMethods.pix, merchantCity: e.target.value }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Boletos Bancários</CardTitle>
                </div>
                <CardDescription>Integração com gateway de boletos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="boleto-enabled">Habilitar Boletos</Label>
                  <Switch 
                    id="boleto-enabled" 
                    checked={config.paymentMethods.boleto.enabled}
                    onCheckedChange={(c) => setConfig({
                      ...config, 
                      paymentMethods: { 
                        ...config.paymentMethods, 
                        boleto: { ...config.paymentMethods.boleto, enabled: c } 
                      }
                    })}
                  />
                </div>
                {config.paymentMethods.boleto.enabled && (
                  <div className="space-y-2">
                    <Label>Provedor</Label>
                    <Select 
                      value={config.paymentMethods.boleto.provider}
                      onValueChange={(v) => setConfig({
                        ...config,
                        paymentMethods: {
                          ...config.paymentMethods,
                          boleto: { ...config.paymentMethods.boleto, provider: v }
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asaas">Asaas</SelectItem>
                        <SelectItem value="juno">Juno</SelectItem>
                        <SelectItem value="iugu">Iugu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Cartão de Crédito</CardTitle>
                </div>
                <CardDescription>Integração com gateway de pagamentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cc-enabled">Habilitar Cartão</Label>
                  <Switch 
                    id="cc-enabled" 
                    checked={config.paymentMethods.creditCard.enabled}
                    onCheckedChange={(c) => setConfig({
                      ...config, 
                      paymentMethods: { 
                        ...config.paymentMethods, 
                        creditCard: { ...config.paymentMethods.creditCard, enabled: c } 
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
