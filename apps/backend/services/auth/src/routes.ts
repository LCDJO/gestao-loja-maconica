import { Router } from "express";
import {
  authenticateToken,
  authenticateSuperAdmin,
  authenticateAdmin,
} from "./middleware/auth";
import {
  superAdminLogin,
  superAdminProfile,
} from "./controllers/superAdminController";
import {
  adminLogin,
  adminProfile,
} from "./controllers/adminController";

const router = Router();

// ========== SUPER-ADMIN ROUTES ==========
/**
 * POST /api/auth/super-admin/login
 * Body: { email, password }
 * Returns: { token, refreshToken, user }
 */
router.post("/super-admin/login", superAdminLogin);

/**
 * GET /api/auth/super-admin/profile
 * Requires: Bearer token (SUPER_ADMIN)
 */
router.get("/super-admin/profile", authenticateSuperAdmin, superAdminProfile);

// ========== ADMIN ROUTES ==========
/**
 * POST /api/auth/admin/login
 * Body: { email, password, lodgeId }
 * Returns: { token, refreshToken, user }
 */
router.post("/admin/login", adminLogin);

/**
 * GET /api/auth/admin/profile
 * Requires: Bearer token (ADMIN)
 */
router.get("/admin/profile", authenticateAdmin, adminProfile);

// ========== HEALTH CHECK ==========
router.get("/health", (_req, res) => {
  res.json({ status: "Auth Service is running" });
});

export default router;
