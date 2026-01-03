import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  login,
  logout,
  refresh,
  verify,
} from '../controllers/authController';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/profileController';
import {
  getBalance,
  getTransactions,
  addTransaction,
} from '../controllers/financialController';

const router = Router();

// ============= AUTENTICAÇÃO =============
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', refresh);
router.get('/verify', authenticateToken, verify);

// ============= PERFIL =============
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/update', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);

// ============= FINANCEIRO =============
router.get('/finances/balance', authenticateToken, getBalance);
router.get('/finances/transactions', authenticateToken, getTransactions);
router.post('/finances/transactions', authenticateToken, addTransaction);

export default router;
