# Estrutura de Componentes por Domínios

Esta estrutura organiza os componentes por contexto de negócio (domínios), facilitando a manutenção e escalabilidade.

## 🏗️ Domínios

### 📋 `administracao/`
Componentes para gestão administrativa, configurações e controle de sistema.
- Usuários e permissões
- Configurações gerais
- Auditoria e logs
- Backup e restauração

### 🎂 `aniversariantes/`
Funcionalidades relacionadas a membros aniversariantes.
- Lista de aniversariantes
- Notificações de aniversário
- Eventos de aniversário

### 📚 `biblioteca/`
Gestão de acervo bibliográfico.
- Cadastro de livros
- Empréstimos
- Devoluções
- Catálogo

### ❤️ `caridade/`
Programas e ações de caridade.
- Registros de caridade
- Beneficiários
- Relatórios de impacto

### 🤝 `comissoes/`
Gestão de comissões internas.
- Criação e edição
- Membros de comissões
- Reuniões
- Atas

### 📅 `cronograma/`
Calendário e agenda de eventos.
- Eventos maçônicos
- Sessões
- Reuniões
- Lembretes

### 💰 `financeiro/`
Gestão financeira e contábil.
- Transações
- Relatórios financeiros
- Tesouraria
- Tronco de beneficência

### 👥 `irmaos/`
Gestão de membros da loja.
- Cadastro de membros
- Perfis
- Graus e títulos
- Atividades

### 📜 `pranchas/`
Publicações e pranchas (artigos).
- Publicação de pranchas
- Histórico
- Aprovações
- Arquivo

### ⚙️ `sistema/`
Componentes de infraestrutura e sistema.
- Configurações técnicas
- Integração com APIs
- Status de serviços

### 🌟 `vida-maconica/`
Registros de vida maçônica.
- Histórico de atividades
- Marcos importantes
- Evolução pessoal

### 🔧 `shared/`
Componentes compartilhados entre domínios.
- Modals reutilizáveis
- Forms padrão
- Filtros
- Paginação

## 📁 Estrutura de Pastas

```
components/
├── domains/
│   ├── administracao/
│   │   ├── index.ts
│   │   ├── ConfiguradorSistema.tsx
│   │   └── ...
│   ├── aniversariantes/
│   │   ├── index.ts
│   │   ├── ListaAniversariantes.tsx
│   │   └── ...
│   └── ...
├── ui/                    # Componentes de UI genéricos (Radix UI)
├── layout/                # Layout components
├── shared/
│   ├── index.ts
│   ├── Modal.tsx
│   └── ...
└── index.ts              # Arquivo de re-exportação central
```

## 🔄 Importação de Componentes

**Ao invés de:**
```typescript
import { ListaAniversariantes } from '@/components/aniversariantes';
```

**Use:**
```typescript
import { ListaAniversariantes } from '@/components/domains/aniversariantes';
```

## 📦 Index.ts de Cada Domínio

Cada domínio deve ter um `index.ts` que re-exporta seus componentes:

```typescript
// components/domains/aniversariantes/index.ts
export { ListaAniversariantes } from './ListaAniversariantes';
export { CardAniversariante } from './CardAniversariante';
export { ModalAniversario } from './ModalAniversario';
```

## ✅ Convenções

- Componentes em PascalCase: `ListaAniversariantes.tsx`
- Interfaces/Types em `types.ts` ou inline
- Hooks específicos de domínio em `hooks.ts`
- Utils específicas em `utils.ts`
- Sempre ter `index.ts` para fácil importação

## 🚀 Próximas Etapas

- [ ] Migrar componentes de v2 para respectivos domínios
- [ ] Converter JavaScript → TypeScript
- [ ] Criar hooks customizados por domínio
- [ ] Documentar componentes com Storybook
