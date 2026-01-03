import DashboardLayout from "@/components/layout/DashboardLayout";
import { ListaPranchas } from "@/components/domains/pranchas";

export default function Pranchas() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <ListaPranchas />
      </div>
    </DashboardLayout>
  );
}
