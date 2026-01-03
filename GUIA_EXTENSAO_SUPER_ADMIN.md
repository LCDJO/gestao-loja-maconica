# 🔧 Guia de Extensão - Como Adicionar Novos Componentes

## 1. Adicionando uma Nova Página em um Departamento

### Exemplo: Adicionar "Relatório de Graus" em Chancelaria

#### Passo 1: Criar o arquivo
```typescript
// apps/frontend/src/pages/admin/chancelaria/graus/RelatorioGraus.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Trophy } from "lucide-react";

export default function RelatorioGraus() {
  return (
    <DashboardLayout 
      title="Relatório de Graus" 
      subtitle="Histórico de iniciações e graus maçônicos"
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Graus Conferidos
            </CardTitle>
            <CardDescription>
              Listagem completa de graus conferidos na loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Seu conteúdo aqui */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

#### Passo 2: Adicionar rota em App.tsx
```typescript
// Adicionar importação
import RelatorioGraus from "./pages/admin/chancelaria/graus/RelatorioGraus";

// Adicionar rota
<Route path={"/admin/chancelaria/graus"}>
  {() => (
    <SuperAdminProtectedRoute>
      <RelatorioGraus />
    </SuperAdminProtectedRoute>
  )}
</Route>
```

#### Passo 3: Adicionar ao menu
```typescript
// em config/menuStructure.ts, dentro do departamento Chancelaria

{
  label: "Graus e Promoções",
  icon: Trophy,
  href: "/admin/chancelaria/graus"
}
```

---

## 2. Adicionando um Novo Departamento

### Exemplo: Adicionar "Biblioteca Digital"

#### Passo 1: Criar estrutura de pastas
```bash
mkdir -p apps/frontend/src/pages/admin/biblioteca/{acervo,categorias,emprestimos}
```

#### Passo 2: Criar Dashboard
```typescript
// apps/frontend/src/pages/admin/biblioteca/BibliotecaDashboard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BookOpen, Users, BarChart3 } from "lucide-react";

export default function BibliotecaDashboard() {
  return (
    <DashboardLayout 
      title="Biblioteca Digital" 
      subtitle="Gestão do acervo e empréstimos"
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Livros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">324</div>
            </CardContent>
          </Card>
          {/* ... mais stats */}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Acervo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href="/admin/biblioteca/acervo" className="p-3 rounded border hover:bg-gray-50">
                Gerenciar Acervo
              </a>
            </CardContent>
          </Card>
          {/* ... mais cards */}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

#### Passo 3: Adicionar ao App.tsx
```typescript
import BibliotecaDashboard from "./pages/admin/biblioteca/BibliotecaDashboard";

<Route path={"/admin/biblioteca"}>
  {() => (
    <SuperAdminProtectedRoute>
      <BibliotecaDashboard />
    </SuperAdminProtectedRoute>
  )}
</Route>
```

#### Passo 4: Adicionar ao menu
```typescript
// em config/menuStructure.ts, adicionar novo módulo

{
  id: "super-admin",
  label: "Super Admin",
  items: [
    // ... departamentos existentes ...
    {
      label: "Biblioteca Digital",
      icon: BookOpen,
      href: "#biblioteca",
      submenu: [
        { label: "Acervo", icon: BookOpen, href: "/admin/biblioteca/acervo" },
        { label: "Categorias", icon: List, href: "/admin/biblioteca/categorias" },
        { label: "Empréstimos", icon: Users, href: "/admin/biblioteca/emprestimos" },
      ],
    }
  ]
}
```

---

## 3. Adicionando um Componente Reutilizável

### Exemplo: Stats Card Component

```typescript
// apps/frontend/src/components/admin/StatsCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trendValue && (
          <p className={`text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "+" : ""}{trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Uso:
// <StatsCard 
//   title="Total de Membros" 
//   value={1234} 
//   trend="up" 
//   trendValue="+12% este mês"
// />
```

---

## 4. Adicionando um Submenu Específico

### Exemplo: Expandir Secretaria com mais opções

```typescript
// em config/menuStructure.ts

{
  label: "Secretaria",
  icon: ScrollText,
  href: "#secretaria",
  submenu: [
    { label: "Membros da Loja", icon: Users, href: "/admin/secretaria/membros" },
    { label: "Candidatos", icon: Users, href: "/admin/secretaria/candidatos" },
    { label: "Sessões", icon: Calendar, href: "/admin/secretaria/sessoes" },
    { label: "Balaústres", icon: Users, href: "/admin/secretaria/balaustres" },
    { label: "Usuários", icon: Users, href: "/admin/secretaria/usuarios" },
    
    // NOVAS OPÇÕES
    { label: "Cunhadas", icon: Users, href: "/admin/secretaria/cunhadas" },
    { label: "Sobrinhos", icon: Users, href: "/admin/secretaria/sobrinhos" },
    { label: "Documentos", icon: FileText, href: "/admin/secretaria/documentos" },
  ],
}
```

---

## 5. Adicionando Proteção de Role Específica

### Exemplo: Apenas tesoureiro pode acessar Tesouraria

```typescript
// apps/frontend/src/pages/admin/tesouraria/TesourariaDashboard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TesouariaDashboard() {
  const [navigate] = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Verificar role específica
    const userRole = localStorage.getItem("user_role");
    if (userRole !== "super-admin" && userRole !== "tesoureiro") {
      navigate("/admin");
      return;
    }
    setHasAccess(true);
  }, [navigate]);

  if (!hasAccess) return null;

  return (
    <DashboardLayout title="Tesouraria" subtitle="...">
      {/* Conteúdo */}
    </DashboardLayout>
  );
}
```

---

## 6. Adicionando Integração com API

### Exemplo: Buscar dados de membros

```typescript
// apps/frontend/src/pages/admin/secretaria/membros/MembrosTable.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import * as membersApi from "@/lib/membersApi";

export default function MembrosTable() {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await membersApi.getMembros(token);
        
        if (response.success) {
          setMembros(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembros();
  }, []);

  return (
    <DashboardLayout title="Membros" subtitle="Lista de membros da loja">
      <Card>
        <CardHeader>
          <CardTitle>Membros ({membros.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Nome</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Grau</th>
                </tr>
              </thead>
              <tbody>
                {membros.map((membro: any) => (
                  <tr key={membro.id}>
                    <td>{membro.name}</td>
                    <td>{membro.email}</td>
                    <td>{membro.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
```

---

## 7. Padrão de Formulário

### Exemplo: Novo Membro

```typescript
// apps/frontend/src/pages/admin/secretaria/membros/NovoMembro.tsx

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NovoMembro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    grau: "Aprendiz",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Chamar API
      toast.success("Membro criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar membro");
    }
  };

  return (
    <DashboardLayout title="Novo Membro" subtitle="Cadastro de novo membro">
      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grau</label>
              <select
                value={formData.grau}
                onChange={(e) => setFormData({ ...formData, grau: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option>Aprendiz</option>
                <option>Companheiro</option>
                <option>Mestre</option>
              </select>
            </div>

            <Button type="submit">Criar Membro</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
```

---

## 8. Checklist para Nova Funcionalidade

- [ ] Criar arquivo `.tsx` em pasta apropriada
- [ ] Importar `DashboardLayout`, `Card`, componentes UI
- [ ] Criar componente com `export default`
- [ ] Adicionar rota em `App.tsx`
- [ ] Envolver em `SuperAdminProtectedRoute`
- [ ] Adicionar ao menu em `menuStructure.ts`
- [ ] Testar navegação
- [ ] Verificar erros TypeScript
- [ ] Adicionar documentação
- [ ] Fazer commit

---

## 9. Dicas de Desenvolvimento

### Use DashboardLayout para Consistência
```typescript
<DashboardLayout 
  title="Título da Página"
  subtitle="Descrição"
>
  {/* Conteúdo */}
</DashboardLayout>
```

### Organize por Cards
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Use Icons do Lucide
```typescript
import { Users, Trophy, Banknote } from "lucide-react";

<Users className="w-5 h-5" />
```

### Sempre Proteja Rotas
```typescript
<Route path={"/admin/..."}>
  {() => (
    <SuperAdminProtectedRoute>
      <YourComponent />
    </SuperAdminProtectedRoute>
  )}
</Route>
```

### Use Toast para Feedback
```typescript
import { toast } from "sonner";

toast.success("Sucesso!");
toast.error("Erro!");
toast.loading("Carregando...");
```

---

**Última atualização**: 3 de janeiro de 2026
**Versão**: 1.0.0
