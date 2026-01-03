# Members Service - Portal do Irmão

Microsserviço responsável pela autenticação, perfil e dados financeiros dos membros (irmãos) da Loja Maçônica.

## 🚀 Quick Start

### Instalação
```bash
pnpm install
```

### Desenvolvimento
```bash
pnpm run dev
```

O serviço estará disponível em: `http://localhost:3002`

### Build
```bash
pnpm run build
```

### Produção
```bash
pnpm start
```

## 📋 Estrutura do Projeto

```
src/
├── index.ts                 # Entrada principal do serviço
├── types.ts                 # Tipos TypeScript compartilhados
├── schemas.ts               # Validação com Zod
├── database.ts              # Simulação de banco de dados
├── routes.ts                # Configuração de rotas
├── middleware/
│   └── auth.ts              # Middleware de autenticação JWT
└── controllers/
    ├── authController.ts    # Login, logout, refresh, verify
    ├── profileController.ts # Perfil e mudança de senha
    └── financialController.ts # Saldo e transações
```

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3002/api/members
```

### 🔐 Autenticação

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "joao@masonica.org",
  "password": "senha123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "name": "João Pereira",
      "email": "joao@masonica.org",
      "cim": "CIM-2020-001",
      "degree": "mestre",
      "status": "ativo",
      ...
    }
  }
}
```

#### Refresh Token
```http
POST /refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "new_token",
    "refreshToken": "new_refresh_token",
    "user": {...}
  }
}
```

#### Verify Token
```http
GET /verify
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "valid": true,
    "user": {...}
  }
}
```

#### Logout
```http
POST /logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### 👤 Perfil

#### Obter Perfil
```http
GET /profile
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Pereira da Silva",
    "email": "joao@masonica.org",
    "phone": "(21) 98765-4321",
    "birthDate": "1985-06-15",
    "cpf": "123.456.789-00",
    "address": "Rua das Flores, 123",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "zipCode": "20000-000",
    "cim": "CIM-2020-001",
    "degree": "mestre",
    "status": "ativo",
    "initiationDate": "2020-01-15",
    "createdAt": "2020-01-15T00:00:00Z",
    "updatedAt": "2026-01-03T10:30:00Z"
  }
}
```

#### Atualizar Perfil
```http
PUT /profile/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "(21) 99999-8888",
  "address": "Rua Nova, 456"
}

Response: 200 OK
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": {...}
}
```

#### Alterar Senha
```http
PUT /password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "senha123456",
  "newPassword": "novaSenha@123",
  "confirmPassword": "novaSenha@123"
}

Response: 200 OK
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

### 💰 Financeiro

#### Obter Saldo
```http
GET /finances/balance
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "balance": 1250.75,
    "totalIncome": 5000.00,
    "totalExpense": 3749.25,
    "lastUpdated": "2026-01-03T10:30:00Z"
  }
}
```

#### Listar Transações
```http
GET /finances/transactions?limit=10&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "1",
        "date": "2026-01-01",
        "type": "despesa",
        "category": "mensalidade",
        "description": "Mensalidade janeiro",
        "amount": 100.00
      },
      ...
    ],
    "total": 3
  }
}
```

#### Adicionar Transação
```http
POST /finances/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "despesa",
  "category": "mensalidade",
  "description": "Mensalidade janeiro",
  "amount": 100.00,
  "date": "2026-01-01"
}

Response: 201 Created
{
  "success": true,
  "message": "Transação criada com sucesso",
  "data": {...}
}
```

## 🔐 Autenticação com JWT

### Como usar

1. **Login** → Receba `token` e `refreshToken`
2. **Requisições Autenticadas** → Inclua header: `Authorization: Bearer {token}`
3. **Token Expirado** → Use `refreshToken` para gerar novo `token`
4. **Logout** → Revoga o token

### Variáveis de Ambiente

```env
# Segurança
JWT_SECRET=sua-chave-secreta-aqui
REFRESH_TOKEN_SECRET=sua-chave-refresh-secreta

# Servidor
PORT=3002
NODE_ENV=development
```

## 🧪 Dados de Teste

### Membro Padrão
- **Email:** joao@masonica.org
- **Senha:** senha123456
- **Nome:** João Pereira da Silva
- **CIM:** CIM-2020-001
- **Grau:** Mestre
- **Status:** Ativo

## ⚠️ Notas Importantes

### Desenvolvimento
- O banco de dados é simulado em memória (não persiste dados)
- As senhas são armazenadas em texto plano (usar bcrypt em produção)
- Tokens revogados ficam em memória (usar Redis em produção)

### Produção
- Implementar banco de dados real (PostgreSQL, MySQL, etc.)
- Usar bcrypt para hash de senhas
- Usar Redis para blacklist de tokens
- Implementar HTTPS/TLS
- Adicionar rate limiting
- Adicionar validação de email
- Implementar 2FA (autenticação de dois fatores)

## 📝 Validações

### Login
- Email válido (RFC 5322)
- Senha mínimo 6 caracteres

### Atualizar Perfil
- Nome mínimo 3 caracteres
- Email válido
- Todos os campos são opcionais

### Alterar Senha
- Senha atual deve ser correta
- Nova senha mínimo 8 caracteres
- Confirmação deve coincidir com nova senha

## 🔄 Fluxo de Autenticação

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /login
       ├─────────────────────────┐
       │                         │
       │                    ┌────▼─────────────┐
       │                    │ Members Service  │
       │                    │  (port 3002)     │
       │                    └────┬─────────────┘
       │ 2. {token, refreshToken}│
       │◀─────────────────────────┘
       │
       │ 3. GET /profile
       │    Authorization: Bearer token
       ├─────────────────────────┐
       │                         │
       │                    ┌────▼─────────────┐
       │                    │ Valida JWT       │
       │                    │ Retorna dados    │
       │                    └────┬─────────────┘
       │ 4. Profile data         │
       │◀─────────────────────────┘
```

## 🐛 Troubleshooting

### "Token inválido ou expirado"
- Verifique se o token não expirou (24h)
- Use o refreshToken para gerar novo token
- Certifique-se que JWT_SECRET está correto

### "Email ou senha incorretos"
- Verifique email e senha
- Use dados de teste: joao@masonica.org / senha123456

### CORS errors
- O serviço aceita requisições de qualquer origem (*)
- Para restringir, atualize a configuração CORS em index.ts

## 📚 Links Úteis

- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Zod Validation](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🎯 Próximas Implementações

- [ ] Integração com banco de dados real
- [ ] Hash de senhas com bcrypt
- [ ] Validação de email com link de confirmação
- [ ] Recuperação de senha
- [ ] Rate limiting
- [ ] 2FA (Two-Factor Authentication)
- [ ] Auditoria de ações
- [ ] Notificações em tempo real
- [ ] Upload de foto/avatar
- [ ] Integração com serviço de financeiro real
