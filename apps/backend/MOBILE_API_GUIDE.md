# 📱 Guia de API para Aplicativos Mobile (React Native)

**Status**: Pronto para Publicação em App Stores  
**Versão**: 1.0.0  
**Data**: 3 de janeiro de 2026

---

## 📋 Sumário Executivo

O backend foi estruturado para suportar aplicativos **React Native** multiplataforma:

✅ **Isolamento Multitenant** - Cada loja tem dados isolados  
✅ **Autenticação JWT** - Tokens seguros com refresh automático  
✅ **APIs Otimizadas** - Compressão, paginação e caching  
✅ **Deep Linking** - Navegação direto em links (push notifications)  
✅ **Offline-first** - Suporte para sincronização em segundo plano  

---

## 🏗️ Arquitetura de Dados

### Isolamento Multitenant

Cada **Loja Maçônica** (lodge) é completamente isolada:

```
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
├─────────────────────────────────────────┤
│                                         │
│  Loja 1 (lodge_id: uuid-123)            │
│  ├─ users (filtro: lodge_id=123)        │
│  ├─ members (filtro: lodge_id=123)      │
│  ├─ transactions (filtro: lodge_id=123) │
│  └─ documents (filtro: lodge_id=123)    │
│                                         │
│  Loja 2 (lodge_id: uuid-456)            │
│  ├─ users (filtro: lodge_id=456)        │
│  ├─ members (filtro: lodge_id=456)      │
│  ├─ transactions (filtro: lodge_id=456) │
│  └─ documents (filtro: lodge_id=456)    │
│                                         │
└─────────────────────────────────────────┘
```

**Cada usuário:**
- Pertence a exatamente 1 loja (lodge_id imutável)
- Só acessa dados da sua loja
- JWT token inclui lodge_id para validação

### Relacionamento de Dados

```
users (Autenticação)
  └─ lodge_id → lodges (isolamento)
  
members (Membros)
  ├─ lodge_id → lodges
  └─ user_id → users

transactions (Tesouraria)
  ├─ lodge_id → lodges
  └─ member_id → members

documents (Secretaria)
  └─ lodge_id → lodges

attendance (Presença)
  ├─ lodge_id → lodges
  └─ member_id → members
```

---

## 🔐 Autenticação & Autorização

### Fluxo de Login

```
┌──────────────┐
│   App Mobile │
└──────┬───────┘
       │ 1. POST /api/members/login
       │    { email, password, lodge_id }
       │
       ▼
┌──────────────────────┐
│ Members Service      │
│ :3002                │
├──────────────────────┤
│ 1. Buscar usuário    │
│ 2. Validar senha     │
│ 3. Gerar JWT tokens  │
│ 4. Incluir lodge_id  │
└──────┬───────────────┘
       │
       │ {
       │   token: "eyJhbGc...",
       │   refreshToken: "eyJh...",
       │   user: {
       │     id, email, name,
       │     lodgeId, role, 
       │     member: { cim, degree, status }
       │   }
       │ }
       │
       ▼
┌──────────────────────┐
│  App Mobile          │
│  Armazena tokens     │
│  em SecureStore      │
└──────────────────────┘
```

### JWT Payload

```json
{
  "iat": 1234567890,
  "exp": 1234654290,
  "memberId": "uuid-member",
  "email": "joao@masonica.org",
  "lodgeId": "uuid-lodge-123",
  "role": "member",
  "degree": "mestre"
}
```

**Tokens:**
- **Access Token** (JWT): Válido por 24 horas
- **Refresh Token** (JWT): Válido por 7 dias
- **Storage**: `SecureStore` (react-native-keychain)

### Token Refresh Automático

```javascript
// App Mobile (Interceptor Automático)
API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const newToken = await refreshToken();
      return API(originalRequest);
    }
    throw error;
  }
);
```

---

## 📡 Endpoints da API

### Base URL

```
Production:  https://api.gestao-loja.com.br
Development: http://localhost:3002
```

**Headers Obrigatórios:**

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept-Encoding: gzip, deflate
X-App-Version: 1.0.0
X-Platform: ios | android
```

---

## 🔑 Endpoints de Autenticação

### 1️⃣ Login

**POST** `/api/members/login`

**Body:**
```json
{
  "email": "joao@masonica.org",
  "password": "senha123456",
  "lodgeId": "uuid-loja-opcional"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "user": {
      "id": "member-uuid",
      "email": "joao@masonica.org",
      "name": "João da Silva",
      "lodgeId": "lodge-uuid-123",
      "lodgeName": "Loja Maçônica do Recife",
      "role": "member",
      "member": {
        "cim": "12345",
        "degree": "mestre",
        "status": "ativo",
        "initiation_date": "2015-06-21"
      }
    }
  }
}
```

**Erros (400, 401):**
```json
{
  "success": false,
  "error": "Email ou senha incorretos"
}
```

---

### 2️⃣ Refresh Token

**POST** `/api/members/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

---

### 3️⃣ Verify Token

**GET** `/api/members/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "expiresAt": "2026-01-04T10:30:00Z"
  }
}
```

---

### 4️⃣ Logout

**POST** `/api/members/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 👤 Endpoints de Perfil (Secretaria)

### 1️⃣ Obter Perfil do Membro

**GET** `/api/members/profile`

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@masonica.org",
      "name": "João da Silva",
      "lodgeId": "uuid"
    },
    "member": {
      "id": "uuid",
      "cim": "12345",
      "degree": "mestre",
      "status": "ativo",
      "birth_date": "1980-05-15",
      "initiation_date": "2015-06-21",
      "photo_url": "https://cdn.gestao-loja.com.br/photos/...",
      "documents": [
        {
          "type": "diploma",
          "url": "https://cdn.gestao-loja.com.br/docs/..."
        }
      ]
    }
  }
}
```

---

### 2️⃣ Atualizar Perfil

**PUT** `/api/members/profile/update`

**Body:**
```json
{
  "name": "João da Silva Santos",
  "birth_date": "1980-05-15",
  "phone": "(81) 99999-9999",
  "address": "Rua das Flores, 123",
  "city": "Recife",
  "state": "PE"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": { /* dados atualizados */ }
}
```

---

### 3️⃣ Alterar Senha

**PUT** `/api/members/password`

**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha",
  "confirmPassword": "nova_senha"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

## 💰 Endpoints Financeiros (Tesouraria)

### 1️⃣ Saldo Financeiro

**GET** `/api/members/finances/balance`

**Query Parameters:**
```
?currency=BRL
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "balance": 1500.50,
    "currency": "BRL",
    "lastUpdate": "2026-01-03T14:30:00Z",
    "pendingAmount": 250.00,
    "status": "ok"
  }
}
```

---

### 2️⃣ Extrato de Transações

**GET** `/api/members/finances/transactions`

**Query Parameters:**
```
?page=1
&limit=20
&month=2025-12
&category=mensalidade,tronco
&sort=date.desc
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "date": "2025-12-15T10:00:00Z",
        "type": "receita",
        "category": "mensalidade",
        "description": "Mensalidade Janeiro/2025",
        "amount": 150.00,
        "status": "pago",
        "dueDate": "2025-12-20"
      }
    ],
    "pagination": {
      "total": 48,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

---

### 3️⃣ Boletos/Faturas Pendentes

**GET** `/api/members/finances/invoices`

**Query Parameters:**
```
?status=pending,overdue
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "uuid",
        "month": "2026-01",
        "description": "Mensalidade Janeiro/2026",
        "amount": 150.00,
        "dueDate": "2026-01-15",
        "status": "pending",
        "barcode": "12345.67890 12345.678901 12345.678901 1 12345678901234",
        "pdfUrl": "https://cdn.gestao-loja.com.br/invoices/..."
      }
    ]
  }
}
```

---

## 📚 Endpoints de Secretaria

### 1️⃣ Lista de Membros

**GET** `/api/members/list`

**Query Parameters:**
```
?page=1
&limit=50
&search=joao
&degree=mestre,companheiro
&status=ativo
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "uuid",
        "cim": "12345",
        "name": "João da Silva",
        "email": "joao@masonica.org",
        "degree": "mestre",
        "status": "ativo",
        "phone": "(81) 99999-9999",
        "photo_url": "https://cdn..."
      }
    ],
    "pagination": {
      "total": 156,
      "page": 1,
      "limit": 50,
      "pages": 4
    }
  }
}
```

---

### 2️⃣ Detalhes do Membro (Outros Membros)

**GET** `/api/members/{memberId}/public`

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "cim": "12345",
    "name": "João da Silva",
    "email": "joao@masonica.org",
    "degree": "mestre",
    "status": "ativo",
    "initiation_date": "2015-06-21",
    "phone": "(81) 99999-9999",
    "photo_url": "https://cdn...",
    "bio": "Profissão: Engenheiro..."
  }
}
```

---

## 📋 Endpoints de Documentos (Secretaria)

### 1️⃣ Meus Documentos

**GET** `/api/members/documents`

**Query Parameters:**
```
?type=diploma,certificado,atestado
&limit=100
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "uuid",
        "type": "diploma",
        "name": "Diploma de Mestre",
        "description": "Diploma conferido em 21/06/2015",
        "url": "https://cdn.gestao-loja.com.br/docs/...",
        "size": 2048000,
        "uploadedAt": "2025-12-01T10:00:00Z",
        "expiresAt": null
      }
    ]
  }
}
```

---

### 2️⃣ Upload de Documento

**POST** `/api/members/documents/upload`

**Form Data:**
```
file: <binary>
type: diploma
description: "Descrição opcional"
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "url": "https://cdn.gestao-loja.com.br/docs/...",
    "uploadedAt": "2026-01-03T14:30:00Z"
  }
}
```

---

## 📅 Endpoints de Presença & Atividades

### 1️⃣ Histórico de Presença

**GET** `/api/members/attendance`

**Query Parameters:**
```
?month=2025-12
&limit=50
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "id": "uuid",
        "date": "2025-12-15T20:00:00Z",
        "type": "reuniao",
        "title": "Reunião Ordinária",
        "status": "presente",
        "justified": false,
        "notes": "Presença confirmada"
      }
    ]
  }
}
```

---

### 2️⃣ Próximos Eventos

**GET** `/api/members/events/upcoming`

**Query Parameters:**
```
?limit=10
&daysAhead=30
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Reunião Ordinária",
        "description": "Pauta: Eleições do próximo triênio",
        "type": "reuniao",
        "date": "2026-01-15T20:00:00Z",
        "location": "Templo",
        "isRequired": true
      }
    ]
  }
}
```

---

## 🏥 Endpoints de Saúde (Hospitalaria)

### 1️⃣ Status de Saúde do Membro

**GET** `/api/members/health`

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "status": "well",
    "lastUpdate": "2025-12-15T10:00:00Z",
    "notes": "",
    "relatedMembers": [
      {
        "memberId": "uuid",
        "name": "Nome do Membro",
        "relationship": "cônjuge",
        "healthStatus": "recuperando"
      }
    ]
  }
}
```

---

### 2️⃣ Atualizar Status de Saúde

**PUT** `/api/members/health`

**Body:**
```json
{
  "status": "well|sick|hospitalized|recovering",
  "notes": "Notas adicionais",
  "visibility": "private|members|public"
}
```

---

## 📱 Otimizações para Mobile

### Compressão de Resposta

Todas as respostas são automaticamente comprimidas com **gzip**:

```http
Request Headers:
Accept-Encoding: gzip, deflate

Response Headers:
Content-Encoding: gzip
Content-Type: application/json
```

### Paginação

Sempre use paginação para listas:

```
GET /api/members/list?page=1&limit=20
```

**Resposta inclui:**
```json
{
  "data": { "items": [...] },
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Cache HTTP

Aproveite cache HTTP:

```http
Cache-Control: public, max-age=3600
ETag: "abc123"
```

---

### Sincronização Offline

Para suporte offline, o app deve:

1. **Armazenar localmente** dados críticos
2. **Sincronizar** quando conectado
3. **Marcar conflitos** para resolução manual

Exemplo com SQLite:

```typescript
// App Mobile
const syncData = async () => {
  const localData = await db.getPendingChanges();
  
  for (const change of localData) {
    try {
      await api.post(`/sync/${change.type}`, change);
      await db.markSynced(change.id);
    } catch (error) {
      if (navigator.onLine) {
        // Erro real, não apenas offline
        await db.markConflict(change.id);
      }
    }
  }
};
```

---

## ⚠️ Tratamento de Erros

### Códigos HTTP Padrão

```
200 OK          - Sucesso
201 Created     - Recurso criado
204 No Content  - Sucesso sem corpo
400 Bad Request - Erro de validação
401 Unauthorized - Token inválido/expirado
403 Forbidden    - Acesso não permitido
404 Not Found    - Recurso não encontrado
429 Too Many Requests - Rate limit atingido
500 Server Error - Erro interno
```

### Formato de Erro Padrão

```json
{
  "success": false,
  "error": "Descrição do erro",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Email inválido"
  }
}
```

---

## 🛡️ Segurança & Rate Limiting

### Rate Limits (por IP/token)

```
GET    /api/members/*    - 100 requisições/minuto
POST   /api/members/*    - 50 requisições/minuto
PUT    /api/members/*    - 50 requisições/minuto
DELETE /api/members/*    - 10 requisições/minuto
```

**Headers de resposta:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1640000000
```

### Validação de CORS

```
Allowed Origins:
- http://localhost:3000 (dev)
- https://app.gestao-loja.com.br (prod)
- exp://localhost:19000 (Expo Go)
```

---

## 🔗 Deep Linking

### URL Schemes

```
Produção:  gestao-loja://
Staging:   gestao-loja-staging://
Desenvolvimento: gestao-loja-dev://
```

### Rotas Suportadas

```
gestao-loja://member/profile
gestao-loja://member/finances/transactions
gestao-loja://member/attendance
gestao-loja://member/documents
gestao-loja://members/list
gestao-loja://members/{memberId}
gestao-loja://events/upcoming
gestao-loja://health
```

### Exemplo: Push Notification com Deep Link

```json
{
  "title": "Presença Confirmada",
  "body": "Sua presença foi registrada",
  "deepLink": "gestao-loja://member/attendance",
  "data": {
    "eventId": "uuid-event",
    "date": "2026-01-15"
  }
}
```

---

## 📊 Monitoramento & Analytics

### Headers de Telemetria

```http
X-App-Version: 1.0.0
X-Platform: ios|android
X-Platform-Version: 15.0
X-Device-Id: unique-uuid
X-Session-Id: session-uuid
```

---

## 🚀 Deploy & Publicação

### Checklist para Produção

- [ ] SSL/TLS habilitado (HTTPS apenas)
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] Logs de erro centralizados
- [ ] Backups automáticos do BD
- [ ] CDN configurado para arquivos estáticos
- [ ] Health check endpoint implementado
- [ ] Monitoramento uptime ativo

### Health Check Endpoint

**GET** `/api/health`

**Resposta:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-01-03T14:30:00Z",
  "database": "connected",
  "services": {
    "members": "ok",
    "finances": "ok",
    "communications": "ok"
  }
}
```

---

## 📚 Documentação Adicional

- [MOBILE_APP_SETUP.md](../MOBILE_APP_SETUP.md) - Guia de setup do app React Native
- [API_REFERENCE.md](./API_REFERENCE.md) - Referência completa de APIs
- [SECURITY.md](./SECURITY.md) - Guia de segurança
- [MONITORING.md](./MONITORING.md) - Observabilidade e logs

---

**Última atualização**: 3 de janeiro de 2026  
**Manutenedor**: Tim de Desenvolvimento  
**Contato**: dev@gestao-loja.com.br
