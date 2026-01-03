# 📚 Guia de API Pública com Swagger

Este documento descreve como usar e manter a documentação Swagger para todos os micro serviços do Gestão Loja Maçônica.

## 📋 Conteúdo

1. [O que é Swagger?](#o-que-é-swagger)
2. [Estrutura de Documentação](#estrutura-de-documentação)
3. [Como Usar Swagger](#como-usar-swagger)
4. [Documentando Endpoints](#documentando-endpoints)
5. [Exemplo Prático](#exemplo-prático)
6. [Boas Práticas](#boas-práticas)
7. [Troubleshooting](#troubleshooting)

---

## O que é Swagger?

**Swagger** (agora OpenAPI) é um padrão de documentação de APIs que permite:

✅ **Documentação automática** - Baseada em comentários JSDoc  
✅ **Testes interativos** - Testar endpoints diretamente na interface  
✅ **Especificação padronizada** - Compatível com ferramentas externas (Postman, etc)  
✅ **Geração de clientes** - Código cliente gerado automaticamente  

**Tecnologias usadas:**
- `swagger-jsdoc`: Converte comentários JSDoc para especificação OpenAPI
- `swagger-ui-express`: Interface visual para testar a API

---

## Estrutura de Documentação

### Localização dos Arquivos

```
packages/shared/src/swagger/
├── swaggerConfig.ts          ← Configuração centralizada
├── endpointExamples.ts       ← Exemplos de documentação
├── EXEMPLO_IMPLEMENTACAO.ts  ← Guia de implementação
└── GUIA_API_PUBLICA.md      ← Este arquivo
```

### Arquivo de Configuração: `swaggerConfig.ts`

Este arquivo contém:

1. **generateSwaggerConfig()** - Gera especificação OpenAPI
2. **setupSwaggerUI()** - Monta interface Swagger no Express

```typescript
// Uso em cada serviço:
import { generateSwaggerConfig, setupSwaggerUI } from "shared/swagger/swaggerConfig";

const swaggerSpec = generateSwaggerConfig({
  title: "Service Name API",
  description: "Descrição do serviço",
  version: "1.0.0",
  port: 3002,
  basePath: "/api/members",
  serviceName: "Members Service",
});

setupSwaggerUI(app, swaggerSpec, "/api-docs");
```

---

## Como Usar Swagger

### Acessando a Interface

Após iniciar o serviço, acesse:

```
http://localhost:{PORTA}/api-docs
```

**Portas de cada serviço:**
- Auth Service: `http://localhost:3001/api-docs`
- Members Service: `http://localhost:3002/api-docs`
- Finances Service: `http://localhost:3003/api-docs`
- Communications Service: `http://localhost:3004/api-docs`
- Audit Service: `http://localhost:3005/api-docs`

### Funcionalidades da Interface

1. **Listar Endpoints** - Todos os endpoints aparecem organizados por tags
2. **Expandir Endpoint** - Clique para ver detalhes (método, URL, parâmetros)
3. **Visualizar Exemplos** - Request/Response examples
4. **Testar Endpoint** - Botão "Try it out"
5. **Configurar Autenticação** - Campo "Authorize" para token JWT

### Testando Endpoints

**Passo a passo:**

1. **Clique em um endpoint** para expandir
2. **Clique em "Try it out"**
3. **Preencha os parâmetros** (se houver)
4. **Clique em "Execute"**
5. **Veja a resposta** (status, headers, body)

**Exemplo com autenticação:**

1. Clique no botão **"Authorize"** (cadeado no topo)
2. Selecione **"bearerAuth"**
3. Insira seu token JWT: `eyJhbGc...` (sem "Bearer ")
4. Clique **"Authorize"**
5. Agora todos os endpoints autenticados usarão o token

---

## Documentando Endpoints

### Estrutura de Comentário JSDoc

Os comentários devem estar **ACIMA** da declaração de rota:

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

### Campos Principais

| Campo | Descrição | Obrigatório |
|-------|-----------|------------|
| `summary` | Título curto do endpoint | ✅ |
| `description` | Descrição detalhada | ✅ |
| `tags` | Categoria do endpoint | ✅ |
| `security` | Requisitos de autenticação | ❌ |
| `parameters` | Parâmetros (query, path, header) | ❌ |
| `requestBody` | Corpo da requisição | ❌ |
| `responses` | Respostas possíveis | ✅ |

### Exemplo Completo: POST com Autenticação

```typescript
/**
 * @swagger
 * /api/members/finances/transactions:
 *   post:
 *     summary: Registrar nova transação
 *     description: Cria um novo registro de transação (apenas Admin/Treasurer)
 *     tags:
 *       - Finances
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - amount
 *               - type
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: "mem_123"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 150.50
 *               type:
 *                 type: string
 *                 enum: [income, expense, bill_payment]
 *               description:
 *                 type: string
 *                 example: "Mensalidade janeiro"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Acesso negado
 *       400:
 *         description: Dados inválidos
 */
router.post('/transactions', authenticateToken, asyncHandler(addTransaction));
```

### Definindo Schemas Reutilizáveis

Em `endpointExamples.ts` ou no seu arquivo de routes:

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
 *           format: email
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, member, treasurer]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
```

Depois use em qualquer resposta:

```typescript
responses:
  200:
    description: Perfil obtido
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/MemberProfile'
```

### Autenticação Bearer

Para endpoints que precisam de JWT:

```typescript
security:
  - bearerAuth: []
```

Isto adiciona um campo "Authorize" na interface Swagger.

---

## Exemplo Prático

### 1. Novo Endpoint: Listar Membros

**Arquivo:** `apps/backend/services/members/src/routes.ts`

```typescript
/**
 * @swagger
 * /api/members/list:
 *   get:
 *     summary: Listar todos os membros
 *     description: |
 *       Retorna lista paginada de membros da loja.
 *       
 *       **Permissões:** Admin ou Secretary
 *     tags:
 *       - Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou email
 *     responses:
 *       200:
 *         description: Lista de membros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MemberProfile'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.get('/list', authenticateToken, asyncHandler(listMembers));
```

### 2. Resultado na Interface Swagger

Ao acessar `http://localhost:3002/api-docs`:

1. ✅ Aparece na seção "Members"
2. ✅ Mostra resumo: "Listar todos os membros"
3. ✅ Tem ícone de cadeado (requer autenticação)
4. ✅ Mostra parâmetros query (page, limit, search)
5. ✅ Pode-se testar diretamente na interface

---

## Boas Práticas

### ✅ DO's

**Sempre:**
- Documentar TODOS os endpoints públicos
- Usar tags para organizar endpoints
- Incluir exemplos de valores (`example: "value"`)
- Documentar possíveis erros (401, 403, 400, 404, 500)
- Usar descrições claras em português
- Definir schemas reutilizáveis para tipos comuns

```typescript
/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil                        ← Claro e conciso
 *     description: Retorna dados do perfil         ← Mais detalhe
 *     tags:
 *       - Profile                                   ← Categoria
 *     security:
 *       - bearerAuth: []                           ← Autenticação
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Não autenticado             ← Erro esperado
 *       500:
 *         description: Erro do servidor            ← Erro genérico
 */
router.get('/profile', authenticateToken, getProfile);
```

### ❌ DON'Ts

**Evitar:**
- Endpoints sem documentação
- Descrições vagas ("returns data")
- Não documentar campos obrigatórios
- Não incluir exemplos
- Esquecer de documentar erros
- Usar tags inconsistentes

```typescript
// ❌ RUIM
/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Get profile
 */

// ✅ BOM
/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     description: Retorna todas as informações do perfil do membro
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Token inválido ou expirado
 */
```

### Escalabilidade

Para APIs grandes com muitos endpoints:

1. **Separe documentação por arquivo**:
   ```
   src/
   ├── routes/
   │   ├── auth.ts           (com comentários @swagger)
   │   ├── members.ts        (com comentários @swagger)
   │   ├── finances.ts       (com comentários @swagger)
   │   └── index.ts
   └── swagger/
       └── schemas.ts         (tipos reutilizáveis)
   ```

2. **Centralize schemas**:
   ```typescript
   // src/swagger/schemas.ts
   export const schemas = {
     MemberProfile: { ... },
     Transaction: { ... },
     Balance: { ... }
   };
   ```

3. **Configure em swaggerConfig.ts**:
   ```typescript
   apis: [
     './src/routes/auth.ts',
     './src/routes/members.ts',
     './src/routes/finances.ts',
     './src/swagger/schemas.ts'
   ]
   ```

---

## Troubleshooting

### Problema: Endpoints não aparecem no Swagger

**Causa:** Comentários JSDoc não estão sendo lidos

**Solução:**
1. Verifique se `apis: ['./src/routes.ts']` está correto no `generateSwaggerConfig`
2. Certifique-se de usar `/** @swagger ... */` (triplo asterisco)
3. Reinicie o servidor (`npm run dev`)

### Problema: Schemas não resolvem (erro de referência)

**Causa:** Schema não está definido

**Solução:**
```typescript
// ❌ ERRADO - Schema não existe
schema:
  $ref: '#/components/schemas/MySchema'

// ✅ CORRETO - Defina antes de usar
/**
 * @swagger
 * components:
 *   schemas:
 *     MySchema:
 *       type: object
 */
```

### Problema: Autenticação não funciona no Swagger

**Causa:** Token não está sendo enviado

**Solução:**
1. Clique em "Authorize" (cadeado no topo)
2. Selecione "bearerAuth"
3. Copie seu token (SEM "Bearer " no início)
4. Cole e clique "Authorize"

### Problema: Documentação em inglês/português misturado

**Solução:** Mantenha consistência - escolha um idioma para toda a API:

```typescript
// ✅ CONSISTENTE - Tudo em português
/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     description: Retorna os dados do perfil
 *     tags:
 *       - Perfil
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 */
```

---

## Próximos Passos

### Para Cada Serviço

1. **Auth Service** (`apps/backend/services/auth/`)
   - Documentar endpoints de login, refresh, verify
   - Definir schemas de autenticação

2. **Finances Service** (`apps/backend/services/finances/`)
   - Documentar transações, faturas, relatórios
   - Incluir filtros e paginação

3. **Communications Service** (`apps/backend/services/communications/`)
   - Documentar envio de emails, notificações
   - Incluir templates e configurações

4. **Audit Service** (`apps/backend/services/audit/`)
   - Documentar logs e eventos
   - Incluir filtros de data/tipo

### Integração com Frontend

```typescript
// apps/frontend/src/lib/swaggerClient.ts
export const openSwaggerDocs = (port: number) => {
  window.open(`http://localhost:${port}/api-docs`, '_blank');
};

// Usar em página de admin/configurações
<button onClick={() => openSwaggerDocs(3002)}>
  Ver Documentação API
</button>
```

### Exportar Especificação

A especificação JSON está disponível em:

```
http://localhost:{PORT}/api-docs/spec.json
```

Pode ser importada em:
- **Postman**: Collection → Import → Link
- **Insomnia**: Create → Paste as cURL
- **Ferramentas de código**: Swagger Codegen

---

## Referências

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Guide](https://github.com/Surnet/swagger-jsdoc)
- [JSDoc Syntax](https://jsdoc.app/)

---

**Data:** 3 de janeiro de 2026  
**Versão:** 1.0.0  
**Status:** Documentação completa para implementação
