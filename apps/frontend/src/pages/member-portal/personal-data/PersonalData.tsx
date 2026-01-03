import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberPortalLayout from "@/components/member-portal/MemberPortalLayout";

interface PersonalDataForm {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function PersonalData() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalDataForm>({
    name: "Irmão",
    email: "irmao@email.com",
    phone: "(XX) XXXXX-XXXX",
    birthDate: "1990-01-01",
    cpf: "XXX.XXX.XXX-XX",
    address: "Rua --",
    city: "--",
    state: "--",
    zipCode: "XXXXX-XXX",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // TODO: Integrar com API do backend
    console.log("Salvando dados:", formData);
    setIsEditing(false);
  };

  return (
    <MemberPortalLayout currentPage="personal-data">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Dados</h1>
            <p className="text-gray-600 mt-1">
              Mantenha suas informações pessoais atualizadas
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </Button>
          )}
        </div>

        {/* Personal Data Form */}
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Endereço - Full width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition ${
                  isEditing
                    ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex gap-4 justify-end">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </Card>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Alguns campos como CPF não podem ser
            alterados por razões de segurança.
          </p>
        </div>
      </div>
    </MemberPortalLayout>
  );
}
