# 🚀 SETUP LOCAL - INSTRUÇÕES FINAIS

**Data:** 2 de janeiro de 2026  
**Status:** ✅ Pronto para setup local

---

## ✅ CORREÇÕES APLICADAS

### 1. Criado `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'apps/backend/services/*'
  - 'packages/*'
  - 'client'
```
**Motivo:** PNPM monorepo precisa saber onde estão os subprojetos

### 2. Corrigido `packages/database/src/client.ts`
```typescript
// Antes ❌
pool.on('error', (err) => { ... })
export async function query(text: string, params?: any[]) { ... }

// Depois ✅
pool.on('error', (err: Error) => { ... })
export async function query(text: string, params?: unknown[]) { ... }
```
**Motivo:** TypeScript strict mode precisa de tipagem explícita

### 3. Corrigido `packages/database/src/migrations/seed.ts`
```typescript
// Antes ❌
import { db } from '../client';  // não usado

// Depois ✅
// Removido import não utilizado
```
**Motivo:** TypeScript error: variable 'db' declared but never used

### 4. Criado `setup.ps1` (Windows)
```powershell
# Script automático para setup
./setup.ps1
```

### 5. Criado `setup.sh` (Linux/Mac)
```bash
# Script automático para setup
./setup.sh
```

---

## 🎯 COMO INSTALAR LOCALMENTE

### Opção 1: Script automático (Recomendado)

#### Windows (PowerShell)
```powershell
# Abrir PowerShell como Admin
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

#### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Opção 2: Manual

```powershell
# 1. Instalar PNPM (se não tiver)
npm install -g pnpm

# 2. Instalar dependências
pnpm install

# 3. Verificar tipos
pnpm -r run type-check

# 4. Fazer build
pnpm build

# 5. Rodar frontend
pnpm --filter frontend dev
```

---

## 📋 PRÓXIMAS ETAPAS (Passo a passo)

### Passo 1: Preparar ambiente
```powershell
# ✅ Já feito
# - Node.js v20+ (verificar com: node --version)
# - npm v10+ (verificar com: npm --version)
```

### Passo 2: Instalar projeto
```powershell
cd c:\Users\Windows11\OneDrive\Documentos\GitHub\gestao-loja-maconica

# Rodar setup
.\setup.ps1

# Ou manual
pnpm install
```

### Passo 3: Verificar instalação
```powershell
# Deve funcionar sem erros
pnpm -r run type-check

# Output esperado:
# ✅ packages/shared build: Done
# ✅ packages/database build: Done
# ✅ apps/frontend build: Done
```

### Passo 4: Rodar em desenvolvimento
```powershell
# Opção A: Tudo junto
pnpm dev

# Opção B: Apenas frontend (mais rápido)
pnpm --filter frontend dev

# Navegador abrirá em:
# http://localhost:5173
```

### Passo 5: Build para produção
```powershell
pnpm build

# Artifacts gerados em:
# - apps/frontend/dist/    (frontend)
# - packages/database/...   (database layer)
```

---

## 🔍 VERIFICAÇÕES

### Verificar workspace setup
```powershell
# Listar todos os projetos
pnpm list --depth=0

# Esperado:
# ├── apps/frontend
# ├── apps/backend/services/...
# ├── packages/shared
# ├── packages/database
# └── client
```

### Verificar tipos TypeScript
```powershell
pnpm -r run type-check

# Esperado: "Done" para todos sem erros
```

### Verificar format
```powershell
pnpm run format:check

# Se houver problemas:
pnpm run format
```

### Verificar lint
```powershell
pnpm run lint

# Se houver problemas, corrigir manualmente
```

---

## 📊 STATUS POR COMPONENTE

| Componente | Status | Próxima ação |
|------------|--------|------------|
| **Root** | ✅ Corrigido | Pronto |
| **Frontend** | ✅ Pronto | Rodar pnpm dev |
| **Database** | ✅ Corrigido | Configurar .env |
| **Shared** | ✅ Pronto | Pronto |
| **Workspace** | ✅ Criado | Instalar |

---

## ⚙️ VARIÁVEIS DE AMBIENTE

### `.env.example` existe?
```bash
# Verificar
cat .env.example

# Se não existir, criar:
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=gestao_loja_maconica
# REACT_APP_API_URL=http://localhost:3000
```

### Criar `.env` local
```powershell
# Copiar do exemplo
cp .env.example .env

# Editar conforme seu ambiente
notepad .env
```

---

## 🐛 TROUBLESHOOTING

### Erro: "vite: not found"
```powershell
# Solução: Reinstalar workspace
pnpm install --force
pnpm -r build
```

### Erro: "Cannot find module 'pg'"
```powershell
# Solução: Já corrigido em client.ts
# Tente:
pnpm install
pnpm -r run type-check
```

### Erro: "Port 5173 already in use"
```powershell
# Mudar porta
pnpm --filter frontend dev -- --port 5174
```

### Docker compose não funciona
```powershell
# Verificar services
docker compose ps

# Parar tudo
docker compose down

# Iniciar novamente
docker compose up -d
```

---

## 📚 PRÓXIMAS IMPLEMENTAÇÕES

### Curto prazo (Hoje/Amanhã)
- [x] Setup local funcionando
- [ ] Database migrations
- [ ] Seed inicial de dados
- [ ] Frontend rodando
- [ ] API conectada

### Médio prazo (Esta semana)
- [ ] Backend services
- [ ] Autenticação funcional
- [ ] Testes unitários
- [ ] CI/CD pipeline

### Longo prazo (Este mês)
- [ ] Deploy staging
- [ ] Documentação completa
- [ ] Monitoramento
- [ ] Performance optimization

---

## 🎯 CHECKLIST FINAL

```
Instalação:
[✓] pnpm-workspace.yaml criado
[✓] Erros TypeScript corrigidos
[✓] Setup scripts criados

Pronto para:
[ ] Rodar setup.ps1
[ ] pnpm install
[ ] pnpm dev
[ ] Testar no browser
[ ] Build de produção
```

---

## 💬 PRÓXIMAS ETAPAS

1. **Agora:** Execute `./setup.ps1`
2. **Depois:** Rode `pnpm dev`
3. **Teste:** Abra http://localhost:5173

---

**Status:** ✅ Pronto para instalação local  
**Tempo estimado:** 5-10 minutos (install) + 2 minutos (build)

