/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: senha123456
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token (válido por 24h)
 *             refreshToken:
 *               type: string
 *               description: Refresh token (válido por 7 dias)
 *             profile:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [admin, member, treasurer, secretary]
 *
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
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, member, treasurer, secretary]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         memberId:
 *           type: string
 *         amount:
 *           type: number
 *           format: decimal
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [income, expense, bill_payment]
 *         date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *
 *     Balance:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *         totalBalance:
 *           type: number
 *           format: decimal
 *         pendingBills:
 *           type: number
 *           format: decimal
 *         availableCredit:
 *           type: number
 *           format: decimal
 */

/**
 * @swagger
 * /api/members/login:
 *   post:
 *     summary: Autenticar usuário e obter token JWT
 *     description: |
 *       Faz login de um membro e retorna tokens de acesso.
 *
 *       **Fluxo:**
 *       1. Cliente envia email e senha
 *       2. Serviço valida credenciais
 *       3. Gera access token (24h) e refresh token (7 dias)
 *       4. Cliente armazena em localStorage
 *       5. Usa token em requisiçõesposteriores via header Authorization
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             valid:
 *               summary: Credenciais válidas
 *               value:
 *                 email: joao@masonica.org
 *                 password: senha123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/members/logout:
 *   post:
 *     summary: Fazer logout do usuário
 *     description: Revoga o token de acesso do usuário
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 */

/**
 * @swagger
 * /api/members/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     description: |
 *       Usa o refresh token para obter um novo access token.
 *
 *       **Quando usar:**
 *       - Access token expirou (24h)
 *       - Precisa continuar autenticado sem fazer login novamente
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
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
 *       401:
 *         description: Refresh token inválido ou expirado
 */

/**
 * @swagger
 * /api/members/verify:
 *   get:
 *     summary: Verificar se token é válido
 *     description: Valida o token JWT do usuário (usado no frontend para restaurar sessão)
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token é válido
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
 *                     memberId:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     description: Retorna informações do perfil do membro atualmente autenticado
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MemberProfile'
 *       401:
 *         description: Token inválido ou não fornecido
 *       404:
 *         description: Perfil não encontrado
 */

/**
 * @swagger
 * /api/members/profile/update:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     description: Atualiza informações do perfil do membro autenticado
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MemberProfile'
 *       401:
 *         description: Token inválido
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/members/password:
 *   put:
 *     summary: Alterar senha do usuário
 *     description: Permite que o usuário autenticado altere sua senha
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       401:
 *         description: Senha atual inválida ou token expirado
 *       400:
 *         description: Nova senha não atende aos requisitos
 */

/**
 * @swagger
 * /api/members/finances/balance:
 *   get:
 *     summary: Obter saldo financeiro do membro
 *     description: Retorna o saldo total, contas pendentes e crédito disponível
 *     tags:
 *       - Finances
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Balance'
 *       401:
 *         description: Token inválido
 */

/**
 * @swagger
 * /api/members/finances/transactions:
 *   get:
 *     summary: Listar transações do membro
 *     description: |
 *       Retorna histórico de transações do membro autenticado.
 *
 *       **Filtros disponíveis:**
 *       - type: income, expense, bill_payment
 *       - status: pending, completed, cancelled
 *       - dateFrom: data inicial (YYYY-MM-DD)
 *       - dateTo: data final (YYYY-MM-DD)
 *     tags:
 *       - Finances
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, bill_payment]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Transações obtidas com sucesso
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
 *                     total:
 *                       type: integer
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Token inválido
 */

/**
 * @swagger
 * /api/members/finances/transactions:
 *   post:
 *     summary: Registrar nova transação (Admin/Treasurer apenas)
 *     description: Cria um novo registro de transação para um membro
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
 *               - description
 *             properties:
 *               memberId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: decimal
 *               type:
 *                 type: string
 *                 enum: [income, expense, bill_payment]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
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
 *         description: Acesso negado - requer role admin ou treasurer
 *       400:
 *         description: Dados inválidos
 */

export const endpointExamples = 'Este arquivo contém documentação de exemplo para endpoints';
