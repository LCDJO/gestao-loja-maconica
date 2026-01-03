# 🚀 Quick Start - Swagger API Documentation

Guia rápido para começar a usar Swagger no Gestão Loja Maçônica.

## ⚡ 5 Minutos para Começar

### 1. Instalar Dependências

As dependências já foram adicionadas aos `package.json` de cada serviço:

```bash
pnpm install
```

### 2. Iniciar um Serviço

```bash
# Do diretório raiz
cd apps/backend/services/members
pnpm dev
```

Ou use o script global:

```bash
pnpm dev  # Inicia tudo de uma vez
```

### 3. Acessar Swagger

Abra seu navegador:

```
http://localhost:3002/api-docs
```

✅ Pronto! Você verá a documentação interativa.

---

## 🎯 Próximo Passo: Documentar Endpoints

### Para o Members Service (exemplo):

**Arquivo:** `apps/backend/services/members/src/routes.ts`

Adicione comentários **ACIMA** de cada rota:

```typescript
/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     description: Retorna dados do perfil do membro autenticado
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Token inválido
 */
router.get('/profile', authenticateToken, asyncHandler(getProfile));
```

### Resultado Imediato

1. Salve o arquivo
2. Atualize a página do Swagger (`F5`)
3. Seu endpoint aparecerá documentado! ✨

---

## 🧪 Testando um Endpoint

### Com Autenticação (Bearer Token)

1. Clique no botão **"Authorize"** (cadeado 🔒)
2. Escolha **"bearerAuth"**
3. Cole seu token JWT:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Clique **"Authorize"**
5. Agora teste qualquer endpoint autenticado

### Sem Autenticação

1. Expanda um endpoint
2. Clique **"Try it out"**
3. Preencha os parâmetros (se houver)
4. Clique **"Execute"**
5. Veja a resposta

---

## 📚 Estrutura de um Comentário Swagger

```typescript
/**
 * @swagger
 * /api/caminho:
 *   metodo:
 *     summary: Título curto
 *     description: Descrição detalhada
 *     tags:
 *       - Categoria
 *     security:
 *       - bearerAuth: []              (se precisar autenticação)
 *     parameters:                      (se tiver parâmetros)
 *       - in: query
 *         name: parametro
 *         schema:
 *           type: string
 *     requestBody:                     (se for POST/PUT)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Descrição da resposta
 */
router.metodo('/caminho', handler);
```

---

## 📝 Exemplo Completo: Login

```typescript
/**
 * @swagger
 * /api/members/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@masonica.org
 *               password:
 *                 type: string
 *                 example: senha123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Email ou senha inválidos
 */
router.post('/login', asyncHandler(login));
```

---

## 🔧 Adicionar Swagger em Outro Serviço

### Auth Service (`http://localhost:3001/api-docs`)

**Arquivo:** `apps/backend/services/auth/src/index.ts`

```typescript
import { generateSwaggerConfig, setupSwaggerUI } from "shared/swagger/swaggerConfig";

// Dentro de startServer():
const swaggerSpec = generateSwaggerConfig({
  title: "Auth Service API",
  description: "API para autenticação e gerenciamento de tokens",
  version: "1.0.0",
  port: 3001,
  basePath: "/api/auth",
  serviceName: "Auth Service",
});
setupSwaggerUI(app, swaggerSpec, "/api-docs");
```

### Finances Service (`http://localhost:3003/api-docs`)

```typescript
const swaggerSpec = generateSwaggerConfig({
  title: "Finances Service API",
  description: "API para gerenciamento de transações e finanças",
  version: "1.0.0",
  port: 3003,
  basePath: "/api/finances",
  serviceName: "Finances Service",
});
setupSwaggerUI(app, swaggerSpec, "/api-docs");
```

### Communications Service (`http://localhost:3004/api-docs`)

```typescript
const swaggerSpec = generateSwaggerConfig({
  title: "Communications Service API",
  description: "API para emails, notificações e WhatsApp",
  version: "1.0.0",
  port: 3004,
  basePath: "/api/communications",
  serviceName: "Communications Service",
});
setupSwaggerUI(app, swaggerSpec, "/api-docs");
```

### Audit Service (`http://localhost:3005/api-docs`)

```typescript
const swaggerSpec = generateSwaggerConfig({
  title: "Audit Service API",
  description: "API para auditoria e logs de atividades",
  version: "1.0.0",
  port: 3005,
  basePath: "/api/audit",
  serviceName: "Audit Service",
});
setupSwaggerUI(app, swaggerSpec, "/api-docs");
```

---

## ✅ Checklist de Implementação

### Members Service ✅ (Pronto)
- [x] Swagger configurado
- [ ] Endpoints documentados (TODO)

### Auth Service ⏳ (TODO)
- [ ] Swagger configurado
- [ ] Endpoints documentados

### Finances Service ⏳ (TODO)
- [ ] Swagger configurado
- [ ] Endpoints documentados

### Communications Service ⏳ (TODO)
- [ ] Swagger configurado
- [ ] Endpoints documentados

### Audit Service ⏳ (TODO)
- [ ] Swagger configurado
- [ ] Endpoints documentados

---

## 🌐 URLs de Acesso

| Serviço | Swagger | API Base |
|---------|---------|----------|
| Auth | http://localhost:3001/api-docs | http://localhost:3001/api/auth |
| Members | http://localhost:3002/api-docs | http://localhost:3002/api/members |
| Finances | http://localhost:3003/api-docs | http://localhost:3003/api/finances |
| Communications | http://localhost:3004/api-docs | http://localhost:3004/api/communications |
| Audit | http://localhost:3005/api-docs | http://localhost:3005/api/audit |

---

## 💡 Dicas

### Exportar Especificação

```bash
# Baixar JSON da especificação Swagger
curl http://localhost:3002/api-docs/spec.json > members-api.json

# Importar em Postman
# Collection → Import → Upload file → members-api.json
```

### Reutilizar Schemas

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     MemberProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 */

// Depois use em qualquer resposta:
responses:
  200:
    schema:
      $ref: '#/components/schemas/MemberProfile'
```

### Documentação em Português

Mantenha tudo em português para consistência:

```typescript
/**
 * @swagger
 * /api/members/perfil:
 *   get:
 *     summary: Obter perfil          ← Português
 *     description: Retorna o perfil   ← Português
 *     tags:
 *       - Perfil                      ← Português
 */
```

---

## 🆘 Problema?

### Endpoints não aparecem

1. Verifique se usou `/** @swagger ... */` (3 asteriscos)
2. Reinicie o servidor: `Ctrl+C` e `pnpm dev`
3. Atualize a página: `F5`

### Autenticação não funciona

1. Clique "Authorize" (cadeado 🔒)
2. Selecione "bearerAuth"
3. Cole seu token (SEM "Bearer ")
4. Clique "Authorize"

### Más de ajuda?

Leia o guia completo: [GUIA_API_PUBLICA.md](./GUIA_API_PUBLICA.md)

---

**Pronto para começar? Abra seu navegador e vá para:**

```
http://localhost:3002/api-docs
```

🎉 Boa sorte!
