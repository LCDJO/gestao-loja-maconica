import DashboardLayout from "@/components/layout/DashboardLayout";
import { VidaMaconica } from "@/components/domains/vida-maconica";

export default function VidaMaconicaPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <VidaMaconica />
      </div>
    </DashboardLayout>
  );
}
