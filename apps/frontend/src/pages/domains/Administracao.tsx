import DashboardLayout from "@/components/layout/DashboardLayout";
import { Administracao } from "@/components/domains/administracao";

export default function AdministracaoPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <Administracao />
      </div>
    </DashboardLayout>
  );
}
