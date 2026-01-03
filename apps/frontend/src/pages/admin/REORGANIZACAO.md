# Reorganização do Módulo Super Admin

## Visão Geral

O módulo Super Admin foi reorganizado seguindo uma estrutura departamental clara, refletindo a hierarquia organizacional de uma loja maçônica.

## Estrutura de Diretórios

```
apps/frontend/src/pages/admin/
├── AdminDashboard.tsx                 # Dashboard principal de Super Admin
├── secretaria/                        # Gestão de membros, candidatos, sessões, usuários
│   ├── SecretariaDashboard.tsx
│   ├── membros/
│   ├── candidatos/
│   ├── sessoes/
│   ├── balaustres/
│   └── usuarios/
├── chancelaria/                       # Frequências, visitas, registros maçônicos
│   ├── ChancelariaDashboard.tsx
│   ├── frequencias/
│   ├── diario/
│   ├── visitas-realizadas/
│   └── visitas-recebidas/
├── tesouraria/                        # Receitas, despesas, contas, extratos
│   ├── TesouariaDashboard.tsx
│   ├── receitas/
│   ├── despesas/
│   ├── contas/
│   └── extrato/
├── presidencia/                       # Administrações, comissões
│   ├── PresidenciaDashboard.tsx
│   ├── administracoes/
│   └── comissoes/
├── relatorios/                        # Análises e relatórios
│   ├── RelatoriosDashboard.tsx
│   └── exportar/
├── configuracoes/                     # Sistema, segurança, backup
│   ├── ConfiguracoesDashboard.tsx
│   ├── geral/
│   ├── seguranca/
│   ├── backup/
│   └── auditoria/
└── integracoes/                       # Email, WhatsApp, Push, Pagamentos
    ├── IntegracoesDashboard.tsx
    ├── email/
    ├── evolution/
    ├── onesignal/
    └── pagamentos/
```

## Rotas Implementadas

### Secretaria
- `/admin/secretaria` - Dashboard
- `/admin/secretaria/membros` - Gestão de membros
- `/admin/secretaria/candidatos` - Gestão de candidatos
- `/admin/secretaria/sessoes` - Agenda de sessões
- `/admin/secretaria/balaustres` - Gestão de balaústres
- `/admin/secretaria/usuarios` - Usuários do sistema

### Chancelaria
- `/admin/chancelaria` - Dashboard
- `/admin/chancelaria/frequencias` - Controle de frequência
- `/admin/chancelaria/diario` - Diário de frequência
- `/admin/chancelaria/visitas-realizadas` - Visitas para outras lojas
- `/admin/chancelaria/visitas-recebidas` - Visitas recebidas

### Tesouraria
- `/admin/tesouraria` - Dashboard
- `/admin/tesouraria/receitas` - Gestão de receitas
- `/admin/tesouraria/despesas` - Gestão de despesas
- `/admin/tesouraria/contas` - Gestão de contas
- `/admin/tesouraria/extrato` - Extrato e movimentações

### Presidência
- `/admin/presidencia` - Dashboard
- `/admin/presidencia/administracoes` - Histórico de administrações
- `/admin/presidencia/comissoes` - Gestão de comissões

### Relatórios
- `/admin/relatorios` - Dashboard
- `/admin/relatorios/membros` - Relatório de membros
- `/admin/relatorios/financeiro` - Relatório financeiro
- `/admin/relatorios/frequencia` - Relatório de frequência
- `/admin/relatorios/exportar` - Exportar dados

### Configurações
- `/admin/configuracoes` - Dashboard
- `/admin/configuracoes/geral` - Parâmetros gerais
- `/admin/configuracoes/seguranca` - Políticas de segurança
- `/admin/configuracoes/backup` - Gerenciamento de backups
- `/admin/configuracoes/auditoria` - Logs de auditoria

### Integrações
- `/admin/integracoes` - Dashboard
- `/admin/integracoes/email` - Configuração de email
- `/admin/integracoes/evolution` - WhatsApp Evolution API
- `/admin/integracoes/onesignal` - OneSignal Push
- `/admin/integracoes/pagamentos` - Gateway de pagamentos

## Menu no sidebar

O menu foi reorganizado no arquivo `config/menuStructure.ts` com um módulo único "Super Admin" contendo todos os departamentos em submenus.

### Estrutura do Menu

```typescript
{
  id: "super-admin",
  label: "Super Admin",
  items: [
    {
      label: "Secretaria",
      submenu: [
        "Membros da Loja",
        "Candidatos",
        "Sessões",
        "Balaústres",
        "Usuários"
      ]
    },
    {
      label: "Chancelaria",
      submenu: [
        "Frequências",
        "Diário de Frequência",
        "Visitas Realizadas",
        "Visitas Recebidas"
      ]
    },
    // ... outros departamentos
  ]
}
```

## Benefícios desta Reorganização

✅ **Estrutura Clara**: Cada departamento em seu próprio diretório
✅ **Escalabilidade**: Fácil adicionar novas funcionalidades
✅ **Manutenibilidade**: Código organizado por responsabilidade
✅ **Navegação Intuitiva**: Menu reflete a hierarquia organizacional
✅ **Isolamento**: Componentes de um departamento não interferem em outro

## Próximos Passos

1. Mover/copiar componentes das páginas antigas para as novas pastas
2. Implementar funcionalidades em cada departamento
3. Criar testes para cada departamento
4. Adicionar validações e tratamento de erros
5. Documentar APIs e endpoints necessários

## Migração de Componentes Antigos

Se você tinha componentes em `/pages/admin/` anteriormente, migre para:

| Arquivo Antigo | Local Novo |
|---|---|
| GerenciamentoUsuarios.tsx | `/admin/secretaria/usuarios/` |
| Permissoes.tsx | `/admin/configuracoes/seguranca/` |
| Auditoria.tsx | `/admin/configuracoes/auditoria/` |
| AuditoriaAcesso.tsx | `/admin/configuracoes/auditoria/` |
| Backup.tsx | `/admin/configuracoes/backup/` |
| Comunicados.tsx | `/admin/secretaria/` |
| Changelog.tsx | `/admin/configuracoes/` |

## Notas Importantes

- ⚠️ O caminho antigo `/super-admin` continua funcionando (redireciona para `/admin`)
- ⚠️ Todas as rotas requerem `SuperAdminProtectedRoute`
- ⚠️ O menu está controlado em `config/menuStructure.ts`

---

**Data**: 3 de janeiro de 2026
**Versão**: 1.0.0
