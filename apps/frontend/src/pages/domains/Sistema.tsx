import DashboardLayout from "@/components/layout/DashboardLayout";
import { DadosLoja } from "@/components/domains/sistema";

export default function Sistema() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <DadosLoja />
      </div>
    </DashboardLayout>
  );
}
