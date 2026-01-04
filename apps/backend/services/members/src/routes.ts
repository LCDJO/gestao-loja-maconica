/**
 * @swagger
 * components:
 *   schemas:
 *     MemberProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do membro
 *         email:
 *           type: string
 *           format: email
 *           description: Email do membro
 *         name:
 *           type: string
 *           description: Nome completo do membro
 *         phone:
 *           type: string
 *           description: Telefone de contato
 *         role:
 *           type: string
 *           enum: [admin, member, treasurer, secretary]
 *           description: Papel/permissão do membro
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da conta
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Última atualização do perfil
 *
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da transação
 *         memberId:
 *           type: string
 *           description: ID do membro
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Valor da transação
 *         description:
 *           type: string
 *           description: Descrição da transação
 *         type:
 *           type: string
 *           enum: [income, expense, bill_payment]
 *           description: Tipo de transação
 *         date:
 *           type: string
 *           format: date
 *           description: Data da transação
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           description: Status da transação
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 */

import { Router } from 'express';
import { authenticateToken } from './middleware/auth';
import {
  login,
  logout,
  refresh,
  verify,
} from './controllers/authController';
import {
  getProfile,
  updateProfile,
  changePassword,
} from './controllers/profileController';
import {
  getBalance,
  getTransactions,
  addTransaction,
} from './controllers/financialController';

// Helper para envolver funções async em rotas Express
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// ============= AUTENTICAÇÃO =============

/**
 * @swagger
 * /api/members/login:
 *   post:
 *     summary: Autenticar usuário e obter token JWT
 *     description: Faz login de um membro e retorna tokens de acesso (24h) e refresh (7d)
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
 *                 format: password
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token (24h)
 *                     refreshToken:
 *                       type: string
 *                       description: Refresh token (7 dias)
 *                     profile:
 *                       $ref: '#/components/schemas/MemberProfile'
 *       400:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', asyncHandler(login));

/**
 * @swagger
 * /api/members/logout:
 *   post:
 *     summary: Fazer logout do usuário
 *     description: Revoga o token de acesso do usuário autenticado
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Token inválido ou expirado
 */
router.post('/logout', authenticateToken, asyncHandler(logout));

/**
 * @swagger
 * /api/members/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     description: Usa o refresh token para obter um novo access token sem fazer login novamente
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
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
router.post('/refresh', asyncHandler(refresh));

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
router.get('/verify', authenticateToken, asyncHandler(verify));

// ============= PERFIL =============

/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     description: Retorna informações completas do perfil do membro atualmente autenticado
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
router.get('/profile', authenticateToken, asyncHandler(getProfile));

/**
 * @swagger
 * /api/members/profile/update:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     description: Atualiza informações do perfil do membro autenticado (nome, telefone, endereço, etc)
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
 *                 example: João da Silva
 *               phone:
 *                 type: string
 *                 example: (11) 98765-4321
 *               address:
 *                 type: string
 *                 example: Rua das Flores, 123
 *               city:
 *                 type: string
 *                 example: São Paulo
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
router.put('/profile/update', authenticateToken, asyncHandler(updateProfile));

/**
 * @swagger
 * /api/members/password:
 *   put:
 *     summary: Alterar senha do usuário
 *     description: Permite que o usuário autenticado altere sua senha com validação da senha atual
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
 *                 example: senha123456
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: novaSenha123456
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Senha atual inválida ou token expirado
 *       400:
 *         description: Nova senha não atende aos requisitos (mínimo 6 caracteres)
 */
router.put('/password', authenticateToken, asyncHandler(changePassword));

// ============= FINANCEIRO =============

/**
 * @swagger
 * /api/members/finances/balance:
 *   get:
 *     summary: Obter saldo financeiro do membro
 *     description: Retorna o saldo total, contas pendentes e crédito disponível do membro autenticado
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
 *                   type: object
 *                   properties:
 *                     memberId:
 *                       type: string
 *                     totalBalance:
 *                       type: number
 *                       format: decimal
 *                       example: 1500.50
 *                     pendingBills:
 *                       type: number
 *                       format: decimal
 *                       example: 250.00
 *                     availableCredit:
 *                       type: number
 *                       format: decimal
 *                       example: 5000.00
 *       401:
 *         description: Token inválido
 */
router.get('/finances/balance', authenticateToken, asyncHandler(getBalance));

/**
 * @swagger
 * /api/members/finances/transactions:
 *   get:
 *     summary: Listar transações do membro
 *     description: |
 *       Retorna histórico de transações do membro autenticado com suporte a filtros.
 *       
 *       **Filtros disponíveis:**
 *       - type: income, expense, bill_payment
 *       - status: pending, completed, cancelled
 *       - dateFrom e dateTo: filtrar por período
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
 *         description: Tipo de transação
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         description: Status da transação
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de registros
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular (paginação)
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
router.get('/finances/transactions', authenticateToken, asyncHandler(getTransactions));

/**
 * @swagger
 * /api/members/finances/transactions:
 *   post:
 *     summary: Registrar nova transação
 *     description: Cria um novo registro de transação para um membro (apenas Admin/Treasurer)
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
 *                 example: mem_12345
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 150.50
 *               type:
 *                 type: string
 *                 enum: [income, expense, bill_payment]
 *                 example: bill_payment
 *               description:
 *                 type: string
 *                 example: Mensalidade janeiro de 2026
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-03
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
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Acesso negado - requer role admin ou treasurer
 *       400:
 *         description: Dados inválidos
 */
router.post('/finances/transactions', authenticateToken, asyncHandler(addTransaction));

export default router;
