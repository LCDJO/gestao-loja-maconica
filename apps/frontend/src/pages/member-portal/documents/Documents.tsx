import { FileText, Download, Eye, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberPortalLayout from "@/components/member-portal/MemberPortalLayout";

interface Document {
  id: string;
  title: string;
  date: string;
  type: string;
  size: string;
}

export default function Documents() {
  const documents: Document[] = [
    {
      id: "1",
      title: "Ata da Sessão - Janeiro 2025",
      date: "2025-01-15",
      type: "PDF",
      size: "2.4 MB",
    },
    {
      id: "2",
      title: "Comunicado Importante",
      date: "2024-12-20",
      type: "PDF",
      size: "1.1 MB",
    },
  ];

  return (
    <MemberPortalLayout currentPage="documents">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600 mt-1">
            Documentos de sessões e comunicados da loja
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar documentos..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Card key={doc.id} className="p-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="p-4 bg-blue-100 rounded-lg flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{doc.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{new Date(doc.date).toLocaleDateString("pt-BR")}</span>
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum documento disponível</p>
            </Card>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Aqui você encontra todos os documentos das
            sessões, comunicados e demais documentos da loja.
          </p>
        </div>
      </div>
    </MemberPortalLayout>
  );
}
