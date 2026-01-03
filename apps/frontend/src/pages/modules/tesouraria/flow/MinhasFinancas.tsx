import DashboardLayout from "@/components/layout/DashboardLayout";
import { MinhasFinancas as MinhasFinancasComponent } from "@/components/domains/financeiro";

export default function MinhasFinancas() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <MinhasFinancasComponent />
      </div>
    </DashboardLayout>
  );
}
