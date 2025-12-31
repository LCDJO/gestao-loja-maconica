import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface LodgeSettings {
  lodgeName: string;
  lodgeNumber: string;
  lodgeCity: string;
  lodgeState: string;
  lodgeEmail: string;
  lodgePhone: string;
  lodgeLogo: string;
}

export default function ConfiguracoesLoja() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<LodgeSettings>({
    lodgeName: 'Loja Exemplo',
    lodgeNumber: '123',
    lodgeCity: 'São Paulo',
    lodgeState: 'SP',
    lodgeEmail: 'contato@lojaexemplo.com',
    lodgePhone: '(11) 99999-9999',
    lodgeLogo: '/images/logo-placeholder.png',
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('lodgeLogo', result);
        toast.success('Logo atualizado');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
            <p className="text-gray-600 mt-2">
              Gerencie as informações gerais da sua loja maçônica
            </p>
          </div>
          <Settings className="h-12 w-12 text-blue-600 opacity-20" />
        </div>

        {/* Informações Gerais */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Dados básicos e identificação da loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Logo da Loja</Label>
              <div className="flex items-center gap-4">
                {settings.lodgeLogo && (
                  <img 
                    src={settings.lodgeLogo} 
                    alt="Logo" 
                    className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm font-medium">Fazer upload</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>

            {/* Nome e Número */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lodge-name" className="text-sm font-medium text-gray-700">Nome da Loja</Label>
                <Input
                  id="lodge-name"
                  value={settings.lodgeName}
                  onChange={(e) => handleChange('lodgeName', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="Ex: Loja Maçônica do Oriente"
                />
              </div>
              <div>
                <Label htmlFor="lodge-number" className="text-sm font-medium text-gray-700">Número da Loja</Label>
                <Input
                  id="lodge-number"
                  value={settings.lodgeNumber}
                  onChange={(e) => handleChange('lodgeNumber', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="Ex: 123"
                />
              </div>
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lodge-city" className="text-sm font-medium text-gray-700">Cidade</Label>
                <Input
                  id="lodge-city"
                  value={settings.lodgeCity}
                  onChange={(e) => handleChange('lodgeCity', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="lodge-state" className="text-sm font-medium text-gray-700">Estado</Label>
                <Input
                  id="lodge-state"
                  value={settings.lodgeState}
                  onChange={(e) => handleChange('lodgeState', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="Ex: SP"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lodge-email" className="text-sm font-medium text-gray-700">Email da Loja</Label>
                <Input
                  id="lodge-email"
                  type="email"
                  value={settings.lodgeEmail}
                  onChange={(e) => handleChange('lodgeEmail', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="contato@loja.com.br"
                />
              </div>
              <div>
                <Label htmlFor="lodge-phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                <Input
                  id="lodge-phone"
                  value={settings.lodgePhone}
                  onChange={(e) => handleChange('lodgePhone', e.target.value)}
                  className="mt-1 border-gray-300"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
