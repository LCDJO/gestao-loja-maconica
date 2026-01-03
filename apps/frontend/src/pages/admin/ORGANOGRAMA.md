# 📊 Organograma do Super Admin - Estrutura Reorganizada

## Hierarquia Departamental

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPER ADMIN DASHBOARD                        │
│                    /admin (ou /super-admin)                         │
└─────────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         │                                                         │
    ┌────▼──────┐      ┌──────────────┐      ┌──────────────┐   │
    │ SECRETARIA │      │  CHANCELARIA │      │  TESOURARIA  │   │
    │  /admin/   │      │   /admin/    │      │   /admin/    │   │
    │ secretaria │      │ chancelaria  │      │ tesouraria   │   │
    └────┬───────┘      └──────┬───────┘      └──────┬───────┘   │
         │                     │                     │             │
         ├─ Membros           ├─ Frequências       ├─ Receitas    │
         ├─ Candidatos        ├─ Diário            ├─ Despesas    │
         ├─ Sessões          ├─ Visitas Realiz.   ├─ Contas      │
         ├─ Balaústres       └─ Visitas Receb.    └─ Extrato     │
         └─ Usuários                                              │
         │                                                         │
    ┌────▼──────────┐      ┌──────────────┐      ┌──────────────┐│
    │  PRESIDÊNCIA   │      │ RELATÓRIOS   │      │CONFIGURAÇÕES ││
    │   /admin/     │      │  /admin/     │      │  /admin/     ││
    │ presidencia    │      │ relatorios   │      │configuracoes ││
    └────┬───────────┘      └──────┬───────┘      └──────┬───────┘│
         │                         │                     │        │
         ├─ Administrações       ├─ Membros             ├─ Geral   │
         └─ Comissões           ├─ Financeiro          ├─ Segurança
                                ├─ Frequência         ├─ Backup
                                └─ Exportar           └─ Auditoria
         │                                                         │
         └─────────────────────────────────────────────────────────┤
                                                                   │
                    ┌──────────────────────────────────────────┘
                    │
            ┌───────▼─────────┐
            │  INTEGRAÇÕES    │
            │   /admin/       │
            │ integracoes     │
            └───────┬─────────┘
                    │
                    ├─ Email
                    ├─ WhatsApp (Evolution)
                    ├─ Push (OneSignal)
                    └─ Pagamentos
```

## Matriz de Departamentos

| Departamento | URL Base | Funções | Ícone |
|---|---|---|---|
| **Secretaria** | `/admin/secretaria` | Membros, Candidatos, Sessões, Balaústres, Usuários | 📜 |
| **Chancelaria** | `/admin/chancelaria` | Frequências, Diário, Visitas | 📋 |
| **Tesouraria** | `/admin/tesouraria` | Receitas, Despesas, Contas, Extrato | 💰 |
| **Presidência** | `/admin/presidencia` | Administrações, Comissões | 🏛️ |
| **Relatórios** | `/admin/relatorios` | Análises, Exportação de Dados | 📊 |
| **Configurações** | `/admin/configuracoes` | Parâmetros, Segurança, Backup, Auditoria | ⚙️ |
| **Integrações** | `/admin/integracoes` | Email, WhatsApp, Push, Pagamentos | 🔌 |

## Fluxo de Navegação

```
Home
 └─ Login Super Admin (/super-admin/login)
     └─ Admin Dashboard (/admin)
         ├─ Secretaria Dashboard (/admin/secretaria)
         │   ├─ Membros (/admin/secretaria/membros)
         │   ├─ Candidatos (/admin/secretaria/candidatos)
         │   ├─ Sessões (/admin/secretaria/sessoes)
         │   ├─ Balaústres (/admin/secretaria/balaustres)
         │   └─ Usuários (/admin/secretaria/usuarios)
         │
         ├─ Chancelaria Dashboard (/admin/chancelaria)
         │   ├─ Frequências (/admin/chancelaria/frequencias)
         │   ├─ Diário (/admin/chancelaria/diario)
         │   ├─ Visitas Realizadas (/admin/chancelaria/visitas-realizadas)
         │   └─ Visitas Recebidas (/admin/chancelaria/visitas-recebidas)
         │
         ├─ Tesouraria Dashboard (/admin/tesouraria)
         │   ├─ Receitas (/admin/tesouraria/receitas)
         │   ├─ Despesas (/admin/tesouraria/despesas)
         │   ├─ Contas (/admin/tesouraria/contas)
         │   └─ Extrato (/admin/tesouraria/extrato)
         │
         ├─ Presidência Dashboard (/admin/presidencia)
         │   ├─ Administrações (/admin/presidencia/administracoes)
         │   └─ Comissões (/admin/presidencia/comissoes)
         │
         ├─ Relatórios Dashboard (/admin/relatorios)
         │   ├─ Membros (/admin/relatorios/membros)
         │   ├─ Financeiro (/admin/relatorios/financeiro)
         │   ├─ Frequência (/admin/relatorios/frequencia)
         │   └─ Exportar (/admin/relatorios/exportar)
         │
         ├─ Configurações Dashboard (/admin/configuracoes)
         │   ├─ Geral (/admin/configuracoes/geral)
         │   ├─ Segurança (/admin/configuracoes/seguranca)
         │   ├─ Backup (/admin/configuracoes/backup)
         │   └─ Auditoria (/admin/configuracoes/auditoria)
         │
         └─ Integrações Dashboard (/admin/integracoes)
             ├─ Email (/admin/integracoes/email)
             ├─ Evolution (/admin/integracoes/evolution)
             ├─ OneSignal (/admin/integracoes/onesignal)
             └─ Pagamentos (/admin/integracoes/pagamentos)
```

## Dashboard Insights

### Super Admin Dashboard
```
┌────────────────────────────────────────────────────────────┐
│  Total de Membros: 1,234  │  Receitas: R$ 12.500           │
│  Despesas: R$ 8.750       │  Taxa de Frequência: 87%       │
└────────────────────────────────────────────────────────────┘

DEPARTAMENTOS
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   SECRETARIA     │  │   CHANCELARIA    │  │    TESOURARIA    │
│ Membros, Cargos │  │ Frequências      │  │ Receitas/Despesas│
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PRESIDÊNCIA    │  │   RELATÓRIOS     │  │  CONFIGURAÇÕES   │
│ Administrações  │  │ Análises         │  │ Sistema/Segurança│
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Estrutura de Componentes

```typescript
// Cada Dashboard segue este padrão:

export default function SecretariaDashboard() {
  return (
    <DashboardLayout title="Secretaria" subtitle="...">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>...</Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>...</Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

## Controle de Acesso

Todas as rotas do Admin requerem:
- ✅ `SuperAdminProtectedRoute`
- ✅ Role: `super-admin`
- ✅ JWT válido e não revogado

```typescript
<Route path={"/admin/secretaria"}>
  {() => (
    <SuperAdminProtectedRoute>
      <SecretariaDashboard />
    </SuperAdminProtectedRoute>
  )}
</Route>
```

## Cores por Departamento

| Departamento | Cor | Hex |
|---|---|---|
| Secretaria | Azul | #3B82F6 |
| Chancelaria | Verde | #10B981 |
| Tesouraria | Roxo | #8B5CF6 |
| Presidência | Âmbar | #F59E0B |
| Relatórios | Índigo | #4F46E5 |
| Configurações | Cinza | #6B7280 |
| Integrações | Laranja | #F97316 |

---

**Última atualização**: 3 de janeiro de 2026
**Versão**: 1.0.0
**Status**: ✅ Implementado
