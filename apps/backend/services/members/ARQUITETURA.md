# 🏗️ Arquitetura - Members Service

## Diagrama Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│              Portal do Irmão - Member Portal                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                  POST /login (email, senha)
                            │
                  ┌─────────▼──────────────┐
                  │                        │
                  │  Members Service       │ (Porta 3002)
                  │  /api/members          │
                  │                        │
                  └─────────┬──────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼───────┐      ┌───────▼──────┐
        │  Controllers  │      │  Middleware  │
        ├───────────────┤      ├──────────────┤
        │ · auth        │      │ · JWT Auth   │
        │ · profile     │      │ · CORS       │
        │ · financial   │      │ · Error      │
        └───────┬───────┘      └──────────────┘
                │
        ┌───────▼──────────────┐
        │  Database (Simula)   │
        ├──────────────────────┤
        │ · Members            │
        │ · Transactions       │
        │ · Sessions           │
        └──────────────────────┘
```

## Fluxo de Requisição

```
1. Cliente (Frontend)
   │
   ├─► POST /api/members/login
   │   {email: "joao@masonica.org", password: "..."}
   │
   ▼
2. Express Server
   │
   ├─► Routes (routes.ts)
   │
   ├─► Controller (authController.ts)
   │   ├─ Validação Zod
   │   ├─ Buscar usuário no BD
   │   ├─ Verificar senha
   │   └─ Gerar JWT tokens
   │
   ▼
3. Resposta
   {
     "success": true,
     "data": {
       "token": "eyJhbGc...",
       "refreshToken": "eyJhbGc...",
       "user": { /* dados */ }
     }
   }
   │
   ▼
4. Cliente Armazena
   localStorage.setItem("token", token)
   localStorage.setItem("refreshToken", refreshToken)

───────────────────────────────────────────────────────

5. Próximas Requisições (Autenticadas)
   GET /api/members/profile
   Headers: Authorization: Bearer {token}
   │
   ▼
6. Express
   │
   ├─► Middleware authenticateToken
   │   ├─ Extrai token do header
   │   ├─ Valida assinatura JWT
   │   └─ Adiciona memberId ao req
   │
   ├─► Controller (profileController.ts)
   │   ├─ Busca usuário por memberId
   │   └─ Retorna dados
   │
   ▼
7. Resposta com dados do perfil
```

## Estrutura de Pastas

```
apps/backend/services/members/
│
├── src/
│   │
│   ├── index.ts ........................... Servidor Express principal
│   │   - Configura middlewares (JSON, CORS, error handling)
│   │   - Monta rotas
│   │   - Inicia servidor na porta 3002
│   │
│   ├── types.ts ........................... Tipos TypeScript
│   │   - MemberProfile
│   │   - MemberLoginRequest
│   │   - MemberAuthResponse
│   │   - UpdateProfileRequest
│   │   - ChangePasswordRequest
│   │   - AuthTokenPayload
│   │   - ApiResponse<T>
│   │
│   ├── schemas.ts ......................... Validações Zod
│   │   - loginSchema
│   │   - updateProfileSchema
│   │   - changePasswordSchema
│   │   - refreshTokenSchema
│   │
│   ├── database.ts ........................ Simulação BD (memória)
│   │   - membersDatabase (Map)
│   │   - findMemberByEmail()
│   │   - findMemberById()
│   │   - updateMember()
│   │   - seedDatabase()
│   │
│   ├── routes.ts .......................... Router Express
│   │   - POST /login
│   │   - POST /logout
│   │   - POST /refresh
│   │   - GET  /verify
│   │   - GET  /profile
│   │   - PUT  /profile/update
│   │   - PUT  /password
│   │   - GET  /finances/balance
│   │   - GET  /finances/transactions
│   │   - POST /finances/transactions
│   │
│   ├── middleware/
│   │   │
│   │   └── auth.ts ........................ JWT e autenticação
│   │       - authenticateToken()
│   │       - generateToken()
│   │       - generateRefreshToken()
│   │       - verifyRefreshToken()
│   │
│   └── controllers/
│       │
│       ├── authController.ts ............ Login/Logout/Refresh/Verify
│       │   - login() ........... POST /login
│       │   - logout() .......... POST /logout
│       │   - refresh() ......... POST /refresh
│       │   - verify() .......... GET /verify
│       │   - revokedTokens .... (token blacklist)
│       │
│       ├── profileController.ts ....... Perfil e Senha
│       │   - getProfile() ....... GET /profile
│       │   - updateProfile() .... PUT /profile/update
│       │   - changePassword() ... PUT /password
│       │
│       └── financialController.ts ... Financeiro
│           - getBalance() .......... GET /finances/balance
│           - getTransactions() .... GET /finances/transactions
│           - addTransaction() ..... POST /finances/transactions
│
├── package.json ........................... Dependências
│   - express ^4.21.2
│   - jsonwebtoken ^9.0.3
│   - zod ^4.1.12
│   - axios ^1.7.7
│   - database (workspace)
│   - shared (workspace)
│
├── tsconfig.json .......................... Configuração TypeScript
├── README.md ............................. Documentação Completa
├── QUICKSTART.md ......................... Guia Rápido
├── IMPLEMENTACAO_COMPLETA.md ............ Este Documento
├── INSOMNIA_API.json .................... Collection de Testes
├── .env.example .......................... Variáveis de Ambiente
└── test-api.sh ........................... Script de Testes
```

## Padrão MVC

```
REQUEST
   │
   ▼
ROUTES (routes.ts)
   │
   ├─ Define método HTTP
   ├─ Define caminho
   ├─ Aplica middlewares
   └─ Aponta para controller
   │
   ▼
CONTROLLER (controllers/*)
   │
   ├─ Recebe requisição
   ├─ Valida entrada (Zod schemas)
   ├─ Chama business logic
   └─ Retorna resposta JSON
   │
   ▼
RESPONSE
```

## Fluxo de Autenticação JWT

```
┌─────────────────────────────────────┐
│     1. LOGIN REQUEST                │
│  {email, password}                  │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────────┐
        │ authController   │
        │   .login()       │
        └────────┬─────────┘
                 │
        ┌────────▼──────────────────────┐
        │ 2. VALIDATION & AUTHENTICATION│
        │  ├─ Validar input (Zod)      │
        │  ├─ Buscar user (database)   │
        │  └─ Verificar senha          │
        └────────┬─────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │ 3. GENERATE TOKENS            │
        │  ├─ JWT Token (24h)           │
        │  └─ Refresh Token (7d)        │
        └────────┬─────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │ 4. RESPONSE                   │
        │  {                            │
        │    token,                     │
        │    refreshToken,              │
        │    user: { ... }              │
        │  }                            │
        └────────┬─────────────────────┘
                 │
   ┌─────────────▼──────────────┐
   │ CLIENT                     │
   │ localStorage.setItem(token)│
   └────────────┬───────────────┘
                │
     ┌──────────▼──────────────┐
     │ 5. NEXT REQUESTS        │
     │ Authorization: Bearer   │
     │  {token}                │
     └──────────┬──────────────┘
                │
     ┌──────────▼──────────────┐
     │ 6. MIDDLEWARE           │
     │ authenticateToken()     │
     │  ├─ Extrai token        │
     │  ├─ Valida JWT          │
     │  └─ Adiciona memberId   │
     └──────────┬──────────────┘
                │
     ┌──────────▼──────────────┐
     │ 7. CONTROLLER           │
     │ (usa req.memberId)      │
     └────────────────────────┘
```

## Banco de Dados (Simulado)

```
membersDatabase (Map<string, Member & { password }>)
│
├─ Chave: ID do membro
│  Valor: {
│    id: "uuid",
│    name: "João",
│    email: "joao@masonica.org",
│    password: "senha123456",  // ⚠️ texto plano - só dev!
│    cim: "CIM-2020-001",
│    degree: "mestre",
│    status: "ativo",
│    ...
│  }
│
└─ Chave: Email
   Valor: (mesmo objeto para rápida busca)

financialData (Map<memberId, FinancialSummary>)
│
├─ Chave: ID do membro
│  Valor: {
│    balance: 1250.75,
│    totalIncome: 5000.00,
│    totalExpense: 3749.25,
│    lastUpdated: "2026-01-03T10:30:00Z"
│  }

transactions (Map<memberId, Transaction[]>)
│
├─ Chave: ID do membro
│  Valor: [
│    {
│      id: "1",
│      date: "2026-01-01",
│      type: "despesa",
│      category: "mensalidade",
│      amount: 100.00
│    },
│    ...
│  ]
```

## Middlewares

```
EXPRESS SERVER
   │
   ├─ express.json()
   │  └─ Parse JSON requests
   │
   ├─ express.urlencoded()
   │  └─ Parse form data
   │
   ├─ CORS Middleware
   │  └─ Access-Control-Allow-*
   │
   ├─ authenticateToken (em rotas protegidas)
   │  ├─ Valida JWT
   │  ├─ Extrai memberId
   │  └─ Passa para controller
   │
   └─ Error Handler
      └─ Captura erros não tratados
```

## Validações (Zod)

```
loginSchema
├─ email: string (email válido)
└─ password: string (mín 6 chars)

updateProfileSchema
├─ name: string (mín 3 chars) - opcional
├─ email: string (email válido) - opcional
├─ phone: string - opcional
├─ birthDate: string - opcional
├─ address: string - opcional
├─ city: string - opcional
├─ state: string - opcional
└─ zipCode: string - opcional

changePasswordSchema
├─ currentPassword: string (mín 6 chars)
├─ newPassword: string (mín 8 chars)
└─ confirmPassword: string (deve coincidir)

refreshTokenSchema
└─ refreshToken: string (obrigatório)
```

## Response Pattern

Todas as respostas seguem:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Exemplo Sucesso
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": { /* dados */ }
  }
}

// Exemplo Erro
{
  "success": false,
  "error": "Email ou senha incorretos"
}
```

## HTTP Status Codes Utilizados

```
200 OK                - Requisição bem-sucedida
201 Created          - Recurso criado (transações)
400 Bad Request      - Validação falhou
401 Unauthorized     - Token ausente ou inválido
403 Forbidden        - Token revogado
404 Not Found        - Recurso não encontrado
500 Internal Server  - Erro no servidor
```

## Segurança em Camadas

```
┌─────────────────────────────────────────┐
│ 1. HTTPS/TLS (em produção)              │
│    └─ Criptogra dados em trânsito       │
├─────────────────────────────────────────┤
│ 2. CORS                                 │
│    └─ Controla origens permitidas       │
├─────────────────────────────────────────┤
│ 3. JWT                                  │
│    └─ Autentica requisições             │
├─────────────────────────────────────────┤
│ 4. Validação Zod                        │
│    └─ Valida estrutura dos dados        │
├─────────────────────────────────────────┤
│ 5. Rate Limiting (TODO)                 │
│    └─ Limita requisições por IP         │
├─────────────────────────────────────────┤
│ 6. bcrypt (TODO)                        │
│    └─ Hash de senhas                    │
├─────────────────────────────────────────┤
│ 7. Email Verification (TODO)            │
│    └─ Valida emails reais               │
└─────────────────────────────────────────┘
```

## Próxima Integração: Banco de Dados Real

```
Atual (Desenvolvimento)
├─ Memória (Map)
└─ Sem persistência

Futuro (Produção)
├─ PostgreSQL / MySQL
├─ Prisma ORM
├─ Migrations
├─ Índices e constraints
└─ Backup automático
```

---

**Arquitetura implementada seguindo padrões REST, MVC e melhorias de segurança! 🔐**
