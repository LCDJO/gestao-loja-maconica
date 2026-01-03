import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

/**
 * Middleware para otimizações específicas para Mobile
 * - Compressão gzip
 * - CORS mobile-friendly
 * - Rate limiting
 * - Caching headers
 * - Request logging
 */

/**
 * Configurar compressão para aplicativos mobile
 */
export const setupMobileOptimizations = (app: any) => {
  // Compressão agressiva para conexões mobile
  app.use(
    compression({
      filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6, // Compressão média (6 de 9) - balanço entre CPU e tamanho
      threshold: 1024, // Comprimir a partir de 1KB
    })
  );

  // CORS para aplicativos mobile
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || '';

    // Permitir localhost (dev)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    // Permitir Expo Go (development)
    else if (origin.startsWith('exp://')) {
      res.header('Access-Control-Allow-Origin', '*');
    }
    // Permitir domínios de produção
    else if (
      origin.includes('gestao-loja.com.br') ||
      origin.includes('app.gestao-loja')
    ) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-Version, X-Platform');
    res.header('Access-Control-Max-Age', '3600');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  });

  // Caching headers inteligente
  app.use((req: Request, res: Response, next: NextFunction) => {
    // GET requests podem ser cacheadas
    if (req.method === 'GET') {
      // Dados estáticos: cache 24h
      if (req.path.includes('/static') || req.path.includes('/photos')) {
        res.set('Cache-Control', 'public, max-age=86400, immutable');
      }
      // Listas: cache 5 minutos
      else if (req.path.includes('/list') || req.path.includes('/members')) {
        res.set('Cache-Control', 'private, max-age=300');
      }
      // Perfil: cache 1 minuto (mais dinâmico)
      else if (req.path.includes('/profile')) {
        res.set('Cache-Control', 'private, max-age=60');
      }
      // Default: sem cache
      else {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    } else {
      // POST, PUT, DELETE: sem cache
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    next();
  });

  // ETag para validação de cache
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      // Gerar ETag simples do corpo (em produção, usar crypto.createHash)
      const etag = `"${Buffer.byteLength(JSON.stringify(body)).toString(16)}"`;
      res.set('ETag', etag);

      // Se cliente enviou If-None-Match
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }

      return originalJson.call(this, body);
    };

    next();
  });

  // Telemetria de requisições mobile
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Extrair informações do app
    const appVersion = req.headers['x-app-version'] || 'unknown';
    const platform = req.headers['x-platform'] || 'unknown';
    const deviceId = req.headers['x-device-id'] || 'unknown';

    // Log estruturado
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logLevel = res.statusCode >= 400 ? 'error' : 'info';

      console.log(JSON.stringify({
        level: logLevel,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        app: {
          version: appVersion,
          platform,
          deviceId,
        },
        user: (req as any).memberId || 'anonymous',
        userAgent: req.headers['user-agent'],
      }));
    });

    next();
  });
};

/**
 * Rate limiting para mobile (por token/IP)
 * Implementar com Redis em produção
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export const mobileRateLimit = (
  windowMs: number = 60000, // 1 minuto
  maxRequests: number = 100
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req as any).memberId || req.ip || 'anonymous';
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      res.set('X-RateLimit-Limit', maxRequests.toString());
      res.set('X-RateLimit-Remaining', (maxRequests - 1).toString());
      res.set('X-RateLimit-Reset', (now + windowMs).toString());
      next();
      return;
    }

    record.count++;

    if (record.count > maxRequests) {
      res.set('Retry-After', Math.ceil((record.resetAt - now) / 1000).toString());
      return res.status(429).json({
        success: false,
        error: 'Muitas requisições. Tente novamente mais tarde.',
        retryAfter: Math.ceil((record.resetAt - now) / 1000),
      });
    }

    res.set('X-RateLimit-Limit', maxRequests.toString());
    res.set('X-RateLimit-Remaining', (maxRequests - record.count).toString());
    res.set('X-RateLimit-Reset', record.resetAt.toString());

    next();
  };
};

/**
 * Validação de app version
 */
const MINIMUM_APP_VERSIONS: Record<string, string> = {
  ios: '1.0.0',
  android: '1.0.0',
};

export const validateAppVersion = (req: Request, res: Response, next: NextFunction) => {
  const appVersion = req.headers['x-app-version'] as string;
  const platform = (req.headers['x-platform'] as string)?.toLowerCase();

  if (!appVersion || !platform) {
    return res.status(400).json({
      success: false,
      error: 'Headers X-App-Version e X-Platform obrigatórios',
    });
  }

  const minVersion = MINIMUM_APP_VERSIONS[platform];
  if (!minVersion) {
    return res.status(400).json({
      success: false,
      error: 'Platform inválida',
    });
  }

  // Verificar versão mínima (simples comparação)
  if (compareVersions(appVersion, minVersion) < 0) {
    return res.status(426).json({
      success: false,
      error: 'App desatualizado. Por favor, atualize pela app store.',
      minimumVersion: minVersion,
      currentVersion: appVersion,
    });
  }

  next();
};

/**
 * Comparar versões semânticas
 * Retorna: -1 (v1 < v2), 0 (v1 == v2), 1 (v1 > v2)
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }

  return 0;
}

/**
 * Response normalizer para Mobile
 * Garante que todas as respostas seguem um padrão
 */
export const mobileResponseNormalizer = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    // Se já está no formato correto, deixar como está
    if (body?.success !== undefined) {
      return originalJson.call(this, body);
    }

    // Normalizar resposta
    const normalized = {
      success: res.statusCode < 400,
      data: body,
      timestamp: new Date().toISOString(),
    };

    return originalJson.call(this, normalized);
  };

  next();
};

/**
 * Error handler específico para mobile
 */
export const mobileErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  const response = {
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
