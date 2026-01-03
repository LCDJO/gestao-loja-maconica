import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import MemberPortalLayout from "@/components/member-portal/MemberPortalLayout";

interface AttendanceRecord {
  id: string;
  date: string;
  sessionType: string;
  status: "present" | "absent" | "justified";
}

export default function Attendance() {
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      date: "2025-01-10",
      sessionType: "Sessão Magna",
      status: "present",
    },
    {
      id: "2",
      date: "2024-12-27",
      sessionType: "Sessão de Aprendiz",
      status: "justified",
    },
    {
      id: "3",
      date: "2024-12-13",
      sessionType: "Sessão Solene",
      status: "absent",
    },
  ];

  const presentCount = attendanceRecords.filter(
    (r) => r.status === "present"
  ).length;
  const absentCount = attendanceRecords.filter(
    (r) => r.status === "absent"
  ).length;
  const justifiedCount = attendanceRecords.filter(
    (r) => r.status === "justified"
  ).length;

  const getStatusBadge = (status: "present" | "absent" | "justified") => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Presente</span>
            <span className="sm:hidden">Sim</span>
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            <XCircle className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Ausente</span>
            <span className="sm:hidden">Não</span>
          </span>
        );
      case "justified":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Justificado</span>
            <span className="sm:hidden">Just.</span>
          </span>
        );
    }
  };

  return (
    <MemberPortalLayout currentPage="attendance">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Histórico de Presença
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Acompanhe seu histórico de presença em sessões
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Presentes */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Presentes</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">
                  {presentCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Ausentes */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Ausentes</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">
                  {absentCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                <XCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
              </div>
            </div>
          </Card>

          {/* Justificadas */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Justificadas</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-2">
                  {justifiedCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Attendance List */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
            Histórico Completo
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {record.sessionType}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">Nenhum registro de presença</p>
              </div>
            )}
          </div>
        </Card>

        {/* Info Box */}
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>Nota:</strong> Este histórico registra sua presença em
            todas as sessões. Faltas justificadas aparecem marcadas como tal.
          </p>
        </div>
      </div>
    </MemberPortalLayout>
  );
}
