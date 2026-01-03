import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';

// Estender Express Request com dados de autenticação
declare global {
  namespace Express {
    interface Request {
      memberId?: string;
      email?: string;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token não fornecido',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.memberId = decoded.memberId;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }
}

export function generateToken(memberId: string, email: string): string {
  return jwt.sign(
    { memberId, email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function generateRefreshToken(memberId: string): string {
  return jwt.sign(
    { memberId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyRefreshToken(token: string): { memberId: string } | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { memberId: string };
  } catch {
    return null;
  }
}
