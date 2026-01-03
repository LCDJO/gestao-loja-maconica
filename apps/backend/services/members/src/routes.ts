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
router.post('/login', asyncHandler(login));
router.post('/logout', authenticateToken, asyncHandler(logout));
router.post('/refresh', asyncHandler(refresh));
router.get('/verify', authenticateToken, asyncHandler(verify));

// ============= PERFIL =============
router.get('/profile', authenticateToken, asyncHandler(getProfile));
router.put('/profile/update', authenticateToken, asyncHandler(updateProfile));
router.put('/password', authenticateToken, asyncHandler(changePassword));

// ============= FINANCEIRO =============
router.get('/finances/balance', authenticateToken, asyncHandler(getBalance));
router.get('/finances/transactions', authenticateToken, asyncHandler(getTransactions));
router.post('/finances/transactions', authenticateToken, asyncHandler(addTransaction));

export default router;
