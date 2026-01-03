import DashboardLayout from "@/components/layout/DashboardLayout";
import { ListaComissoes } from "@/components/domains/comissoes";

export default function Comissoes() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <ListaComissoes />
      </div>
    </DashboardLayout>
  );
}
