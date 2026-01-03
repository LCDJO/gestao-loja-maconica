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
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Documentos de sessões e comunicados da loja
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar documentos..."
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3 sm:space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Card key={doc.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="p-3 sm:p-4 bg-blue-100 rounded-lg flex-shrink-0 w-fit">
                    <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{doc.title}</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                      <span>{new Date(doc.date).toLocaleDateString("pt-BR")}</span>
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none flex items-center gap-2 justify-center text-xs sm:text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Visualizar</span>
                      <span className="sm:hidden">Ver</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none flex items-center gap-2 justify-center text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Baixar</span>
                      <span className="sm:hidden">Download</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 sm:p-12 text-center">
              <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">Nenhum documento disponível</p>
            </Card>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>Nota:</strong> Aqui você encontra todos os documentos das
            sessões, comunicados e demais documentos da loja.
          </p>
        </div>
      </div>
    </MemberPortalLayout>
  );
}
