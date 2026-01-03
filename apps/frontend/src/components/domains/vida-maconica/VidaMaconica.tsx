import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Clock, Target } from 'lucide-react';

export interface GrauMaconica {
  id: string;
  grau: 'Aprendiz' | 'Companheiro' | 'Mestre';
  dataIniciacao: string;
  dataProgressao?: string;
  mestresGuia: string[];
  certificado: boolean;
}

export interface HistoricoVidaMaconica {
  id: string;
  irmaoId: string;
  titulo: string;
  tipo: 'progressao' | 'cargo' | 'evento' | 'formacao';
  data: string;
  descricao: string;
  certificado?: string;
}

interface VidaMaconicaProps {
  irmaoId?: string;
}

export const VidaMaconica: FC<VidaMaconicaProps> = () => {
  const [graus] = useState<GrauMaconica[]>([
    {
      id: '1',
      grau: 'Aprendiz',
      dataIniciacao: '2015-03-15',
      mestresGuia: ['Mestre Silvano'],
      certificado: true,
    },
    {
      id: '2',
      grau: 'Companheiro',
      dataIniciacao: '2017-06-20',
      dataProgressao: '2017-07-15',
      mestresGuia: ['Mestre Silvano', 'Mestre Rafael'],
      certificado: true,
    },
    {
      id: '3',
      grau: 'Mestre',
      dataIniciacao: '2020-09-10',
      dataProgressao: '2020-10-15',
      mestresGuia: ['Mestre Silvano', 'Mestre Rafael', 'Mestre João'],
      certificado: true,
    },
  ]);

  const [historico] = useState<HistoricoVidaMaconica[]>([
    {
      id: '1',
      irmaoId: 'ir1',
      titulo: 'Iniciação no Grau de Aprendiz',
      tipo: 'progressao',
      data: '2015-03-15',
      descricao: 'Iniciado no primeiro grau da maçonaria',
      certificado: 'cert-001',
    },
    {
      id: '2',
      irmaoId: 'ir1',
      titulo: 'Eleito Orador',
      tipo: 'cargo',
      data: '2018-01-20',
      descricao: 'Assumiu o cargo de Orador da loja',
    },
    {
      id: '3',
      irmaoId: 'ir1',
      titulo: 'Progressão para Companheiro',
      tipo: 'progressao',
      data: '2017-07-15',
      descricao: 'Progrediu para o segundo grau',
      certificado: 'cert-002',
    },
    {
      id: '4',
      irmaoId: 'ir1',
      titulo: 'Progressão para Mestre',
      tipo: 'progressao',
      data: '2020-10-15',
      descricao: 'Elevado ao grau máximo da maçonaria azul',
      certificado: 'cert-003',
    },
    {
      id: '5',
      irmaoId: 'ir1',
      titulo: 'Participação em Retiro Maçônico',
      tipo: 'formacao',
      data: '2021-05-10',
      descricao: 'Participou de retiro de desenvolvimento pessoal',
    },
  ]);

  const getGrauIcon = (grau: string) => {
    switch (grau) {
      case 'Aprendiz':
        return <Clock className="h-5 w-5" />;
      case 'Companheiro':
        return <Target className="h-5 w-5" />;
      case 'Mestre':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'progressao':
        return 'bg-purple-100 text-purple-800';
      case 'cargo':
        return 'bg-blue-100 text-blue-800';
      case 'evento':
        return 'bg-green-100 text-green-800';
      case 'formacao':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-purple-600" />
          Vida Maçônica
        </h1>
        <p className="text-gray-600 mt-1">Jornada, progressão de graus e histórico</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="graus" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="graus">Graus</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="certificados">Certificados</TabsTrigger>
        </TabsList>

        {/* Tab Graus */}
        <TabsContent value="graus" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {graus.map((grau) => (
              <Card key={grau.id} className="p-6 border-l-4 border-purple-600">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {getGrauIcon(grau.grau)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{grau.grau}</h3>
                      <p className="text-sm text-gray-600">
                        Iniciado em {new Date(grau.dataIniciacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Mestres Guia */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Mestres Guia</p>
                    <div className="flex flex-wrap gap-2">
                      {grau.mestresGuia.map((mestre, idx) => (
                        <Badge key={idx} variant="secondary">
                          {mestre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certificado */}
                  {grau.certificado && (
                    <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                      ✓ Certificado obtido
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <div className="space-y-4">
            {historico.map((evento, idx) => (
              <Card key={evento.id} className="p-6">
                <div className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center gap-2">
                    <Award className="h-6 w-6 text-purple-600" />
                    {idx < historico.length - 1 && <div className="w-1 h-12 bg-purple-200" />}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{evento.titulo}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(evento.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className={getTipoColor(evento.tipo)}>{evento.tipo}</Badge>
                    </div>
                    <p className="text-gray-600 mt-2">{evento.descricao}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Certificados */}
        <TabsContent value="certificados" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historico
              .filter((e) => e.certificado)
              .map((evento) => (
                <Card key={evento.id} className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-start gap-4">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{evento.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Certificado: {evento.certificado}
                      </p>
                      <Button size="sm" className="mt-3">
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Grau Atual</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">Mestre</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Eventos Registrados</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{historico.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Certificados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {historico.filter((e) => e.certificado).length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default VidaMaconica;
