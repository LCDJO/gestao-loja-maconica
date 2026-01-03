# 🎯 Guia Rápido - Members Service

## ✅ Implementação Completa

O microsserviço `members-service` foi completamente implementado com:

### 📁 Estrutura de Arquivos

```
src/
├── index.ts                      # Servidor principal
├── types.ts                      # Tipos TypeScript
├── schemas.ts                    # Validações Zod
├── database.ts                   # Simulação de BD
├── routes.ts                     # Rotas da API
├── middleware/
│   └── auth.ts                   # JWT e autenticação
└── controllers/
    ├── authController.ts         # Login, logout, refresh, verify
    ├── profileController.ts      # Perfil e senha
    └── financialController.ts    # Financeiro
```

### 🔧 Configuração & Execução

#### Pré-requisitos
- Node.js 18+
- pnpm (já instalado)

#### Desenvolvimento
```bash
cd apps/backend/services/members
pnpm run dev
```

Output esperado:
```
✅ Members Service running on http://localhost:3002/
📝 API Base: http://localhost:3002/api/members
```

#### Build
```bash
cd apps/backend/services/members
pnpm run build
```

#### Produção
```bash
cd apps/backend/services/members
pnpm start
```

### 📡 Endpoints Implementados

#### 🔐 Autenticação (Sem autenticação necessária)
- `POST /login` - Login
- `POST /refresh` - Renovar token
- `GET /verify` - Verificar token (requer Bearer token)
- `POST /logout` - Logout (requer Bearer token)

#### 👤 Perfil (Requer Bearer token)
- `GET /profile` - Obter dados do perfil
- `PUT /profile/update` - Atualizar perfil
- `PUT /password` - Alterar senha

#### 💰 Financeiro (Requer Bearer token)
- `GET /finances/balance` - Saldo
- `GET /finances/transactions` - Transações
- `POST /finances/transactions` - Adicionar transação

### 🧪 Testando a API

#### Via cURL (Linux/Mac/Git Bash)

**1. Login**
```bash
curl -X POST http://localhost:3002/api/members/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@masonica.org","password":"senha123456"}'
```

**2. Copiar o `token` da resposta e usá-lo em requisições autenticadas:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get Profile
curl -X GET http://localhost:3002/api/members/profile \
  -H "Authorization: Bearer $TOKEN"

# Get Balance
curl -X GET http://localhost:3002/api/members/finances/balance \
  -H "Authorization: Bearer $TOKEN"

# Update Profile
curl -X PUT http://localhost:3002/api/members/profile/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Nome","phone":"(21) 99999-8888"}'

# Change Password
curl -X PUT http://localhost:3002/api/members/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"senha123456","newPassword":"novaSenha@123","confirmPassword":"novaSenha@123"}'

# Logout
curl -X POST http://localhost:3002/api/members/logout \
  -H "Authorization: Bearer $TOKEN"
```

#### Via Insomnia/Postman

Importar o arquivo `INSOMNIA_API.json` no Insomnia ou Postman:
1. Abrir Insomnia/Postman
2. Menu → Import
3. Selecionar `INSOMNIA_API.json`
4. Usar as requisições pré-configuradas

### 🔑 Dados de Teste

**Membro padrão do sistema:**
- **Email:** joao@masonica.org
- **Senha:** senha123456
- **Nome:** João Pereira da Silva
- **CIM:** CIM-2020-001
- **Grau:** Mestre
- **Status:** Ativo

### ⚙️ Variáveis de Ambiente

Criar `.env` na raiz do serviço:

```env
# Segurança
JWT_SECRET=sua-chave-secreta-aqui
REFRESH_TOKEN_SECRET=sua-chave-refresh-secreta

# Servidor
PORT=3002
NODE_ENV=development
```

### 🔄 Fluxo de Autenticação

```
1. Frontend faz POST /login com email e senha
2. Backend retorna: token (24h) + refreshToken (7d) + user data
3. Frontend armazena tokens no localStorage
4. Próximas requisições usam: Authorization: Bearer {token}
5. Quando token expira, usar refreshToken para gerar novo
6. Logout revoga o token
```

### 📝 Validações Implementadas

✅ **Login:**
- Email válido (RFC 5322)
- Senha mínimo 6 caracteres

✅ **Atualizar Perfil:**
- Nome mínimo 3 caracteres (opcional)
- Email válido (opcional)
- Outros campos opcionais

✅ **Alterar Senha:**
- Senha atual deve ser correta
- Nova senha mínimo 8 caracteres
- Confirmação deve coincidir

### ⚠️ Importante: Banco de Dados

**DESENVOLVIMENTO:** Dados em memória (não persistem)

**PRODUÇÃO:** Implementar
- PostgreSQL, MySQL, ou MongoDB
- Hash de senhas com bcrypt
- Redis para blacklist de tokens
- Validação de email com confirmação
- 2FA (autenticação de dois fatores)

### 🚀 Próximos Passos

1. **Integrar com Banco de Dados Real**
   - Migrar de memória para PostgreSQL/MySQL
   - Implementar ORM (Prisma, TypeORM)
   - Criar migrations

2. **Segurança em Produção**
   - Usar bcrypt para senhas
   - Rate limiting
   - HTTPS/TLS
   - CORS configurável
   - Validação de email

3. **Funcionalidades Avançadas**
   - Recuperação de senha
   - Avatar/Foto
   - Auditoria de ações
   - Notificações em tempo real
   - 2FA

### 🐛 Troubleshooting

**Erro: "Token inválido ou expirado"**
- Verificar se TOKEN está correto
- Verificar JWT_SECRET está configurada
- Token tem 24h de validade

**Erro: "Email ou senha incorretos"**
- Usar dados padrão: joao@masonica.org / senha123456
- Verificar tipografia

**Erro: CORS**
- Serviço aceita `*` (todas as origens)
- Para restringir, editar `index.ts`

**Erro: PORT já em uso**
- Matar processo: `lsof -ti:3002 | xargs kill -9` (Linux)
- Ou mudar PORT em `.env`

### 📚 Documentação Adicional

- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Zod Validation](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### 📞 Suporte

Para problemas ou dúvidas sobre o microsserviço, consulte:
- `README.md` - Documentação completa
- `src/types.ts` - Tipos e interfaces
- `src/routes.ts` - Estrutura de rotas
