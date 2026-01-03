import DashboardLayout from "@/components/layout/DashboardLayout";
import { ListaIrmaos } from "@/components/domains/irmaos";

export default function Irmaos() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <ListaIrmaos />
      </div>
    </DashboardLayout>
  );
}
