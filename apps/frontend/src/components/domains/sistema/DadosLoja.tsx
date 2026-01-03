import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export interface DadosLoja {
  id: string;
  nome: string;
  numeroLoja: number;
  obreAnciano: string;
  mestredeCerimonia: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  email: string;
  telefone: string;
  website?: string;
  fundacao: string;
  jurisdicao?: string;
  ativa: boolean;
}

interface DadosLojaComponentProps {
  lojaId?: string;
}

export const DadosLoja: FC<DadosLojaComponentProps> = () => {
  const [loja, setLoja] = useState<DadosLoja>({
    id: '1',
    nome: 'Loja Maçônica do Oriente',
    numeroLoja: 123,
    obreAnciano: 'João da Silva',
    mestredeCerimonia: 'Pedro Oliveira',
    endereco: 'Rua das Flores, 456',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    email: 'contato@loja.org.br',
    telefone: '(11) 3000-0000',
    website: 'www.loja.org.br',
    fundacao: '1980-06-15',
    jurisdicao: 'Grande Oriente do Brasil',
    ativa: true,
  });

  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState(loja);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSave = () => {
    setLoja(dados);
    setEditando(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            Dados da Loja
          </h1>
          <p className="text-gray-600 mt-1">Informações e configurações da loja maçônica</p>
        </div>
        <Button
          onClick={() => (editando ? handleSave() : setEditando(true))}
          variant={editando ? 'default' : 'outline'}
        >
          {editando ? 'Salvar' : 'Editar'}
        </Button>
      </div>

      {/* Informações Principais */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Nome</p>
            {editando ? (
              <Input value={dados.nome} name="nome" onChange={handleChange} />
            ) : (
              <p className="text-xl font-bold text-gray-900">{loja.nome}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Número</p>
            {editando ? (
              <Input
                type="number"
                value={dados.numeroLoja}
                name="numeroLoja"
                onChange={handleChange}
              />
            ) : (
              <p className="text-xl font-bold text-gray-900">Nº {loja.numeroLoja}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Fundação</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(loja.fundacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Status</p>
            <div className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
              {loja.ativa ? 'Ativa' : 'Inativa'}
            </div>
          </div>
        </div>
      </Card>

      {/* Dados de Contato */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Dados de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Email</label>
            {editando ? (
              <Input
                type="email"
                value={dados.email}
                name="email"
                onChange={handleChange}
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="h-5 w-5 text-blue-600" />
                {loja.email}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Telefone</label>
            {editando ? (
              <Input
                value={dados.telefone}
                name="telefone"
                onChange={handleChange}
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="h-5 w-5 text-blue-600" />
                {loja.telefone}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 block mb-2">Endereço</label>
            {editando ? (
              <Input
                value={dados.endereco}
                name="endereco"
                onChange={handleChange}
              />
            ) : (
              <div className="flex items-start gap-2 text-gray-900">
                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p>{loja.endereco}</p>
                  <p className="text-sm text-gray-600">
                    {loja.cidade}, {loja.estado} - {loja.cep}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Dados Administrativos */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Dados Administrativos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Obreiro Anciãno</label>
            {editando ? (
              <Input
                value={dados.obreAnciano}
                name="obreAnciano"
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-900">{loja.obreAnciano}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Mestre de Cerimônia</label>
            {editando ? (
              <Input
                value={dados.mestredeCerimonia}
                name="mestredeCerimonia"
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-900">{loja.mestredeCerimonia}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Jurisdição</label>
            {editando ? (
              <Input
                value={dados.jurisdicao || ''}
                name="jurisdicao"
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-900">{loja.jurisdicao}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Website</label>
            {editando ? (
              <Input
                value={dados.website || ''}
                name="website"
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-900">{loja.website || 'Não informado'}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DadosLoja;
