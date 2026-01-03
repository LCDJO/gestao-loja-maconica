import DashboardLayout from "@/components/layout/DashboardLayout";
import { RegistrosCaridade } from "@/components/domains/caridade";

export default function Caridade() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <RegistrosCaridade />
      </div>
    </DashboardLayout>
  );
}
