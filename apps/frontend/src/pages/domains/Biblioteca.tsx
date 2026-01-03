import DashboardLayout from "@/components/layout/DashboardLayout";
import { CatalogoBiblioteca } from "@/components/domains/biblioteca";

export default function Biblioteca() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <CatalogoBiblioteca />
      </div>
    </DashboardLayout>
  );
}
