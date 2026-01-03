import DashboardLayout from "@/components/layout/DashboardLayout";
import { ListaAniversariantes } from "@/components/domains/aniversariantes";

export default function Aniversariantes() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <ListaAniversariantes />
      </div>
    </DashboardLayout>
  );
}
