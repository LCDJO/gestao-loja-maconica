# 📦 Plano de Migração - V2 → Frontend Domínios

## 🎯 Objetivo
Migrar componentes de `apps/frontendv2/src/components/components/` para `apps/frontend/src/components/domains/` com conversão de JavaScript → TypeScript.

---

## 📊 Mapeamento de Componentes

### ✅ Por Domínio

#### 1. **aniversariantes/**
```
V2:
  └── CardAniversariantesDashboard.jsx

Frontend:
  ├── index.ts
  ├── CardAniversariantes.tsx
  ├── ListaAniversariantes.tsx
  └── types.ts
```

#### 2. **administracao/**
```
V2:
  └── administracao/
       └── (arquivos)

Frontend:
  ├── index.ts
  ├── Usuarios.tsx
  ├── Configuracoes.tsx
  └── types.ts
```

#### 3. **biblioteca/**
```
V2:
  └── biblioteca/
       └── (arquivos)

Frontend:
  ├── index.ts
  ├── CatalogoBiblioteca.tsx
  └── types.ts
```

#### 4. **caridade/**
```
V2:
  └── caridade/
       └── (arquivos)

Frontend:
  ├── index.ts
  ├── RegistrosCaridade.tsx
  └── types.ts
```

#### 5. **comissoes/**
```
V2:
  └── comissoes/
       └── (arquivos)

Frontend:
  ├── index.ts
  ├── ListaComissoes.tsx
  └── types.ts
```

#### 6. **cronograma/**
```
V2:
  └── cronograma/

Frontend:
  ├── index.ts
  ├── CalendarioCronograma.tsx
  ├── ListaSessoes.tsx
  └── types.ts
```

#### 7. **financeiro/**
```
V2:
  └── financeiro/
       └── MinhasFinancas.jsx

Frontend:
  ├── index.ts
  ├── MinhasFinancas.tsx
  ├── Tesouraria.tsx
  └── types.ts
```

#### 8. **irmaos/**
```
V2:
  └── irmaos/

Frontend:
  ├── index.ts
  ├── MeuCadastro.tsx
  ├── ListaIrmaos.tsx
  └── types.ts
```

#### 9. **pranchas/**
```
V2:
  └── pranchas/

Frontend:
  ├── index.ts
  ├── ListaPranchas.tsx
  └── types.ts
```

#### 10. **sistema/**
```
V2:
  └── sistema/
       └── DadosLoja.jsx

Frontend:
  ├── index.ts
  ├── DadosLoja.tsx
  └── types.ts
```

#### 11. **vida-maconica/**
```
V2:
  └── vida-maconica/
       ├── VidaMaconica.jsx
       ├── GerenciarGraus.jsx
       └── VisualizarAltosGraus.jsx

Frontend:
  ├── index.ts
  ├── VidaMaconica.tsx
  ├── GerenciadorGraus.tsx
  └── types.ts
```

---

## 📝 Componentes Orphans (sem domínio específico)

Estes precisam ser categorizados:

```
V2:
  ├── CadastroSessao.jsx           → cronograma/
  ├── Dashboard.jsx                → páginas/dashboards/
  ├── DashboardPresenca.jsx        → cronograma/
  ├── Header.jsx                   → components/layout/
  ├── Login.jsx                    → páginas/auth/
  ├── MeuCadastro.jsx              → irmaos/
  ├── MeuCadastroWrapper.jsx       → irmaos/
  ├── MinhaPresenca.jsx            → cronograma/
  ├── MinhasFinancas.jsx           → financeiro/
  ├── ModalEditarSessao.jsx        → cronograma/shared/
  ├── ModalGradePresenca.jsx       → cronograma/shared/
  ├── ModalVisualizarPresenca.jsx  → cronograma/shared/
  ├── PrimeiroAcesso.jsx           → páginas/auth/
  ├── RegistroPresenca.jsx         → cronograma/
  ├── Sidebar.jsx                  → components/layout/
  ├── Sobre.jsx                    → páginas/
  └── TrocarSenha.jsx              → páginas/perfil/
```

---

## 🔄 Processo de Migração

### Fase 1: Setup (Hoje)
- [ ] Criar arquivos `index.ts` em cada domínio
- [ ] Definir `types.ts` para cada domínio
- [ ] Preparar estrutura de pastas

### Fase 2: Componentes por Domínio
Migrar em ordem de complexidade:

1. **Simples** (cards, utilitários)
   - CardAniversariantes
   - DadosLoja
   
2. **Médio** (listas, formulários)
   - ListaIrmaos
   - ListaComissoes
   - MinhasFinancas
   
3. **Complexo** (com state, APIs)
   - VidaMaconica
   - RegistroPresenca

### Fase 3: Ajustes de Rotas
- [ ] Atualizar `App.tsx` com novas rotas
- [ ] Atualizar `DashboardLayout.tsx` com novo menu
- [ ] Testar navegação

---

## 🛠️ Template de Migração

### Antes (V2 - JavaScript)
```jsx
// components/components/aniversariantes/CardAniversariantesDashboard.jsx
export function CardAniversariantesDashboard({ data }) {
  return (
    <div className="card">
      {/* conteúdo */}
    </div>
  );
}
```

### Depois (Frontend - TypeScript)
```tsx
// components/domains/aniversariantes/CardAniversariantes.tsx
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { AniversarianteData } from './types';

interface CardAniversariantesProps {
  data: AniversarianteData;
}

export const CardAniversariantes: FC<CardAniversariantesProps> = ({ data }) => {
  return (
    <Card className="p-4">
      {/* conteúdo */}
    </Card>
  );
};
```

### Index Export
```typescript
// components/domains/aniversariantes/index.ts
export { CardAniversariantes } from './CardAniversariantes';
export type { AniversarianteData } from './types';
```

---

## 📋 Checklist por Componente

```
aniversariantes/
  ├─ CardAniversariantesDashboard.jsx
  │  └─ [ ] Converter para CardAniversariantes.tsx
  │  └─ [ ] Criar types.ts
  │  └─ [ ] Adicionar ao index.ts
  │  └─ [ ] Atualizar imports no projeto

cronograma/
  ├─ CadastroSessao.jsx
  │  └─ [ ] Converter para CadastroSessao.tsx
  ├─ DashboardPresenca.jsx
  │  └─ [ ] Converter para DashboardPresenca.tsx
  └─ ... (mais componentes)

financeiro/
  ├─ MinhasFinancas.jsx
  │  └─ [ ] Converter para MinhasFinancas.tsx
  └─ ... (mais componentes)

irmaos/
  ├─ MeuCadastro.jsx
  │  └─ [ ] Converter para MeuCadastro.tsx
  └─ ... (mais componentes)

sistema/
  └─ DadosLoja.jsx
     └─ [ ] Converter para DadosLoja.tsx

vida-maconica/
  ├─ VidaMaconica.jsx
  │  └─ [ ] Converter para VidaMaconica.tsx
  ├─ GerenciarGraus.jsx
  │  └─ [ ] Converter para GerenciadorGraus.tsx
  └─ VisualizarAltosGraus.jsx
     └─ [ ] Converter para VisualizadorAltosGraus.tsx
```

---

## 🎯 Prioridade de Migração

### Crítica (Primeira)
1. **irmaos/** - MeuCadastro (usado em muitas páginas)
2. **financeiro/** - MinhasFinancas (essencial)
3. **vida-maconica/** - VidaMaconica (importante)

### Alta (Segunda)
4. **cronograma/** - CadastroSessao, RegistroPresenca
5. **administracao/** - configurações gerais

### Média (Terceira)
6. **biblioteca/**
7. **caridade/**
8. **comissoes/**
9. **pranchas/**
10. **sistema/**

---

## 🔗 Próximas Etapas

1. ✅ Criar plan (FEITO)
2. ⏳ Implementar migração por domínio
3. ⏳ Converter JS → TS com tipagem
4. ⏳ Criar exports em index.ts
5. ⏳ Atualizar rotas em App.tsx
6. ⏳ Atualizar menu em DashboardLayout
7. ⏳ Testes de integração
8. ⏳ Remover arquivos antigos de v2

---

**Status:** 📋 Planejado  
**Data:** 3 de janeiro de 2026
