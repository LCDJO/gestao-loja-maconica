# ⚙️ Configurações da Loja

Este diretório contém todas as configurações e gerenciamento específicos da loja maçônica.

## 🗂️ Estrutura

```
config/
├── Configuracoes.tsx              ← Página principal de configurações
├── ConfiguracoesLoja.tsx          ← Dados da loja (nome, endereço, logo)
├── ConfiguracoesPush.tsx          ← Preferências de notificações
├── Parametrizacao.tsx             ← Parâmetros do sistema
├── ConfiguracaoEmail.tsx          ← Templates de email
├── Backup.tsx                     ← Backup e restauração de dados
├── Conciliacao.tsx                ← Conciliação de dados
├── Changelog.tsx                  ← Histórico de mudanças
├── Comunicados.tsx                ← Comunicados internos
├── GerenciamentoUsuarios.tsx      ← Usuários do sistema
├── Permissoes.tsx                 ← Controle de acesso e papéis
├── Auditoria.tsx                  ← Logs de auditoria
├── AuditoriaAcesso.tsx            ← Auditoria de acessos
└── README.md                       ← Este arquivo
```

## 📋 Funcionalidades

### 🏢 Dados da Loja
**Arquivo:** `ConfiguracoesLoja.tsx`

- ✅ Nome da loja maçônica
- ✅ Número de registro
- ✅ Endereço completo (rua, número, cidade, estado)
- ✅ Email e telefone de contato
- ✅ Logo e identidade visual
- ✅ Informações maçônicas (rito, grau, etc)
- ✅ CNPJ e documentação

### 🔔 Configurações de Push
**Arquivo:** `ConfiguracoesPush.tsx`

- ✅ Preferências de notificações
- ✅ Canais de entrega
- ✅ Horários de envio
- ✅ Filtros e regras

### 📧 Configuração de Email
**Arquivo:** `ConfiguracaoEmail.tsx`

- ✅ Servidor SMTP
- ✅ Templates de email
- ✅ Assinatura padrão
- ✅ Horários de envio

### 📊 Parametrização
**Arquivo:** `Parametrizacao.tsx`

- ✅ Valores padrão do sistema
- ✅ Limites e restrições
- ✅ Configurações de negócio
- ✅ Políticas internas

### 💾 Backup
**Arquivo:** `Backup.tsx`

- ✅ Agendamento de backups
- ✅ Backup manual sob demanda
- ✅ Histórico de backups
- ✅ Restauração de dados

### 🔄 Conciliação
**Arquivo:** `Conciliacao.tsx`

- ✅ Sincronização de dados
- ✅ Resolução de conflitos
- ✅ Relatórios de sincronização

### 📝 Comunicados
**Arquivo:** `Comunicados.tsx`

- ✅ Criar e editar comunicados
- ✅ Distribuição para membros
- ✅ Histórico de comunicados

### 👥 Gerenciamento de Usuários
**Arquivo:** `GerenciamentoUsuarios.tsx`

- ✅ CRUD de usuários
- ✅ Ativar/desativar usuários
- ✅ Reset de senhas
- ✅ Histórico de atividades

### 🔐 Permissões
**Arquivo:** `Permissoes.tsx`

- ✅ Criar e editar papéis (roles)
- ✅ Atribuir permissões granulares
- ✅ Hierarquia de acessos
- ✅ Auditoria de permissões

### 📋 Auditoria
**Arquivo:** `Auditoria.tsx`

- ✅ Logs de todas as ações
- ✅ Filtros por usuário/data/ação
- ✅ Exportação de relatórios
- ✅ Retenção de dados

### 🔍 Auditoria de Acesso
**Arquivo:** `AuditoriaAcesso.tsx`

- ✅ Rastreamento de logins
- ✅ Tentativas falhadas
- ✅ Sessões ativas
- ✅ Bloqueio de IP

### 📜 Changelog
**Arquivo:** `Changelog.tsx`

- ✅ Histórico de alterações
- ✅ Versão do sistema
- ✅ Atualizações realizadas

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────┐
│  Configurações da Loja              │
│  (Dados Internos)                   │
└────────────┬────────────────────────┘
             │
        ┌────┴────┐
        │          │
    ┌───▼──┐  ┌───▼──┐
    │ BD   │  │ Logs │
    │Local │  │      │
    └──────┘  └──────┘
```

## 🛡️ Segurança

- ✅ Backup automático diário
- ✅ Logs de auditoria completos
- ✅ Controle de acesso baseado em papéis (RBAC)
- ✅ Criptografia de dados sensíveis
- ✅ Bloqueio de IPs suspeitos
- ✅ Limite de tentativas de login

## 📝 Boas Práticas

1. **Backup Regular**: Fazer backup semanal dos dados
2. **Auditoria**: Revisar logs semanalmente
3. **Permissões**: Manter princípio do menor privilégio
4. **Documentação**: Manter changelog atualizado
5. **Comunicados**: Informar membros sobre mudanças

## 🚀 Rotas

- `/config` - Página principal
- `/config/loja` - Dados da loja
- `/config/push` - Notificações push
- `/config/email` - Configuração email
- `/config/parametrizacao` - Parâmetros
- `/config/backup` - Backup
- `/config/conciliacao` - Sincronização
- `/config/comunicados` - Comunicados
- `/config/usuarios` - Usuários
- `/config/permissoes` - Permissões
- `/config/auditoria` - Logs
- `/config/acesso` - Acesso
- `/config/changelog` - Histórico

## ⚠️ Diferença: Config vs Integrações

| Aspecto | Configurações da Loja | Integrações de Sistema |
|---------|---|---|
| **Dados** | Informações internas da loja | Conexões com serviços externos |
| **Localização** | Banco de dados local | APIs remotas |
| **Controle** | Administrador da loja | Dependente de terceiros |
| **Exemplo** | Nome, endereço, usuários | WhatsApp, Pix, OneSignal |
| **Pasta** | `/config/` | `/integrations/` |
