import DashboardLayout from "@/components/layout/DashboardLayout";
import { MinhasFinancas } from "@/components/domains/financeiro";

export default function Financeiro() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <MinhasFinancas />
      </div>
    </DashboardLayout>
  );
}
