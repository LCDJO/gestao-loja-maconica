# 🔗 Guia de Integração Frontend - Members Service

## Status: ✅ INTEGRAÇÃO COMPLETA

O frontend React do Portal do Irmão foi **totalmente integrado** com o Members Service backend.

---

## 📋 O Que Foi Integrado

### 1️⃣ API Client (`src/lib/membersApi.ts`)
- ✅ 12 funções para consumir todos os endpoints
- ✅ Gerenciamento de tokens (armazenamento, renovação)
- ✅ Tipos TypeScript para todas as respostas
- ✅ Tratamento de erros centralizado

### 2️⃣ Authentication Context (`src/contexts/MemberAuthContext.tsx`)
- ✅ `useMemberAuth()` hook para usar autenticação
- ✅ Gerenciamento de estado de login
- ✅ Renovação automática de tokens
- ✅ Persistência de sessão no localStorage
- ✅ Métodos: login, logout, updateProfile, changePassword, refreshAuth

### 3️⃣ Protected Routes (`src/components/ProtectedMemberRoute.tsx`)
- ✅ Componente para proteger rotas autenticadas
- ✅ Suporte para verificação de role/degree
- ✅ Redirecionamento automático para login
- ✅ Loading state enquanto valida token

### 4️⃣ Login Integration (`src/pages/member-portal/auth/MemberLogin.tsx`)
- ✅ Formulário conectado à API real
- ✅ Validação de entrada
- ✅ Mensagens de erro
- ✅ Dados de teste pré-preenchidos
- ✅ Redirecionamento pós-login

### 5️⃣ Environment Variables
- ✅ `.env.local.example` com configuração
- ✅ `VITE_MEMBERS_API_URL` para flexibilidade
- ✅ Pronto para desenvolvimento e produção

---

## 🚀 Como Usar

### 1. Setup Inicial

**Copiar arquivo de ambiente:**
```bash
cd apps/frontend
cp .env.local.example .env.local
```

**.env.local:**
```env
VITE_MEMBERS_API_URL=http://localhost:3002/api/members
VITE_ENV=development
```

### 2. Iniciar Serviços

**Terminal 1 - Backend (Members Service):**
```bash
cd apps/backend/services/members
pnpm run dev
# Será iniciado em http://localhost:3002
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm run dev
# Será iniciado em http://localhost:5173 (ou outro)
```

### 3. Testar Login

Acesse: `http://localhost:5173/member-portal/auth/login`

**Dados de teste:**
```
Email: joao@masonica.org
Senha: senha123456
```

---

## 📝 Como Integrar Novas Páginas

### Exemplo: Integrar Dashboard com dados reais

**1. Usar o hook de autenticação:**
```tsx
import { useMemberAuth } from '@/contexts/MemberAuthContext';
import * as membersApi from '@/lib/membersApi';

export function Dashboard() {
  const { token, currentMember } = useMemberAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      membersApi.getBalance(token)
        .then(res => setBalance(res.data))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Bem-vindo, {currentMember?.name}</h1>
      <p>Saldo: R$ {balance?.balance}</p>
    </div>
  );
}
```

**2. Proteger a rota:**
```tsx
import ProtectedMemberRoute from '@/components/ProtectedMemberRoute';

<Route 
  path="/member-portal/dashboard" 
  component={() => (
    <ProtectedMemberRoute>
      <Dashboard />
    </ProtectedMemberRoute>
  )} 
/>
```

---

## 🔐 API Client Methods

### Autenticação
```typescript
// Login
await membersApi.loginMember(email, password);

// Logout
await membersApi.logoutMember(token);

// Renovar token
await membersApi.refreshToken(refreshToken);

// Verificar token
await membersApi.verifyToken(token);
```

### Perfil
```typescript
// Obter perfil
await membersApi.getProfile(token);

// Atualizar perfil
await membersApi.updateProfile(token, updates);

// Alterar senha
await membersApi.changePassword(token, currentPwd, newPwd, confirmPwd);
```

### Financeiro
```typescript
// Saldo
await membersApi.getBalance(token);

// Transações
await membersApi.getTransactions(token, limit, offset);

// Criar transação
await membersApi.createTransaction(token, data);
```

### Storage
```typescript
// Gerenciar tokens
membersApi.storeTokens(token, refreshToken);
membersApi.getStoredToken();
membersApi.getStoredRefreshToken();
membersApi.clearTokens();

// Gerenciar perfil
membersApi.storeProfile(profile);
membersApi.getStoredProfile();
```

---

## 🎯 Fluxo de Autenticação

```
┌──────────────────────────────────────────────┐
│ 1. Usuário acessa /member-portal/auth/login  │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 2. MemberLogin renderiza formulário          │
│    (com dados de teste pré-preenchidos)      │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 3. Usuário clica "Entrar"                    │
│    ├─ Valida formulário                      │
│    └─ Chama useMemberAuth().login()          │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 4. MemberAuthContext                         │
│    ├─ Chama membersApi.loginMember()         │
│    ├─ Recebe token + refreshToken + user     │
│    ├─ Armazena em localStorage               │
│    └─ Atualiza estado                        │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 5. MemberLogin redireciona para dashboard    │
│    setLocation("/member-portal/dashboard")   │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 6. Dashboard protegido (ProtectedMemberRoute)│
│    ├─ Verifica isLoggedIn                    │
│    ├─ Verifica token válido                  │
│    └─ Renderiza conteúdo                     │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ 7. Dashboard usa dados do backend            │
│    ├─ const { token } = useMemberAuth()      │
│    ├─ Chama membersApi.getBalance(token)     │
│    └─ Exibe dados reais                      │
└──────────────────────────────────────────────┘
```

---

## 🔄 Renovação Automática de Token

O context automaticamente:

1. **Ao montar**: Carrega token do localStorage
2. **Ao verificar**: Valida se ainda é válido
3. **Se expirado**: Tenta renovar com refreshToken
4. **Se refreshToken também expirou**: Faz logout automático

```tsx
// Automático - você não precisa fazer nada!
const { token } = useMemberAuth();
// Se token expirou, já será renovado automaticamente
```

---

## 📦 Estrutura de Pastas

```
apps/frontend/src/
├── lib/
│   └── membersApi.ts              ✅ API Client (novo)
│
├── contexts/
│   └── MemberAuthContext.tsx       ✅ Atualizado
│
├── components/
│   └── ProtectedMemberRoute.tsx    ✅ Novo
│
├── pages/member-portal/
│   └── auth/
│       └── MemberLogin.tsx         ✅ Atualizado
│
└── .env.local.example              ✅ Novo
```

---

## ⚙️ Configuração

### Frontend (.env.local)
```env
# API do Members Service
VITE_MEMBERS_API_URL=http://localhost:3002/api/members

# Ambiente
VITE_ENV=development
```

### CORS (se em produção)
O Members Service aceita todas as origens (`*`).
Para restringir, edite `apps/backend/services/members/src/index.ts`:

```tsx
// Trocar de:
res.header("Access-Control-Allow-Origin", "*");

// Para:
res.header("Access-Control-Allow-Origin", "https://seu-dominio.com");
```

---

## 🧪 Checklist de Integração

- [x] API Client criado
- [x] MemberAuthContext atualizado
- [x] ProtectedMemberRoute criado
- [x] MemberLogin integrado
- [x] Env variables configuradas
- [x] localStorage com tokens
- [x] Renovação automática de tokens
- [x] Redirecionamento pós-login
- [x] Dados de teste pré-preenchidos
- [x] Tratamento de erros

---

## 🐛 Troubleshooting

### "Erro ao fazer login"

**1. Verificar se Members Service está rodando:**
```bash
curl http://localhost:3002/health
```

Resposta esperada:
```json
{"status": "Members Service is running"}
```

**2. Verificar .env.local:**
```bash
cat .env.local
# Deve ter: VITE_MEMBERS_API_URL=http://localhost:3002/api/members
```

**3. Checar console do navegador:**
- F12 → Console
- Procurar por erros de rede
- Deve haver request para `POST http://localhost:3002/api/members/login`

### "Token inválido"

**Solução:**
1. Limpar localStorage: `localStorage.clear()`
2. Fazer logout
3. Fazer login novamente

### CORS Error

**Problema:** 
```
Access to XMLHttpRequest blocked by CORS
```

**Solução:**
- Verificar `VITE_MEMBERS_API_URL` em `.env.local`
- Verificar se Members Service está rodando
- Se em produção, configurar CORS no backend

---

## 📚 Próximos Passos

1. **Integrar Dashboard:**
   - Usar `membersApi.getBalance()` e `membersApi.getTransactions()`
   - Usar `currentMember` para exibir dados do perfil

2. **Integrar Perfil:**
   - Usar `membersApi.getProfile()` para carregar dados
   - Usar `membersApi.updateProfile()` para atualizar
   - Usar `membersApi.changePassword()` para alterar senha

3. **Integrar Logout:**
   - Usar `useMemberAuth().logout()`
   - Vai fazer logout no backend e limpar localStorage

4. **Adicionar Refresh Automático:**
   - Já está implementado no context
   - Tokens serão renovados automaticamente

---

## ✅ Status Final

| Item | Status |
|------|--------|
| API Client | ✅ COMPLETO |
| Auth Context | ✅ COMPLETO |
| Protected Routes | ✅ COMPLETO |
| Login Integration | ✅ COMPLETO |
| Environment Setup | ✅ COMPLETO |
| Token Management | ✅ COMPLETO |
| Error Handling | ✅ COMPLETO |
| Documentação | ✅ COMPLETO |

---

## 🎉 Próximo: Rodar e Testar

```bash
# Terminal 1: Backend
cd apps/backend/services/members && pnpm run dev

# Terminal 2: Frontend
cd apps/frontend && pnpm run dev
```

Acesse: `http://localhost:5173/member-portal/auth/login`

**Dados de teste:**
- Email: `joao@masonica.org`
- Senha: `senha123456`

✅ **Integração completa e pronta para usar!**
