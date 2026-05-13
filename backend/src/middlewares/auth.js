import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// Validação da chave secreta no startup
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET não configurada! Defina a variável de ambiente JWT_SECRET');
}

function getTokenFromRequest(req) {
  // Prioridade: Bearer token no header (mais seguro)
  const authorization = req.headers['authorization'];

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  // Fallback para cookie (menos comum em APIs modernas)
  if (req.cookies?.cleanline_token) {
    return req.cookies.cleanline_token;
  }

  return null;
}

/**
 * Middleware de autenticação
 * Valida token JWT e popula req.user
 */
export function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      error: 'Token não fornecido',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Verificação rigorosa do token
    const payload = jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'], // Apenas HMAC SHA256
    });

    // Validação básica do payload
    if (!payload.id || !payload.role) {
      throw new Error('Token inválido: payload incompleto');
    }

    req.user = payload;
    next();
  } catch (error) {
    // Não exponha detalhes do erro em produção
    const isDev = process.env.NODE_ENV === 'development';

    return res.status(401).json({
      error: 'Token inválido ou expirado',
      ...(isDev && { debug: error.message }),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware de verificação de permissões de admin
 * Deve ser usado após authMiddleware
 */
export function adminMiddleware(req, res, next) {
  // Verifica se authMiddleware foi executado
  if (!req.user) {
    return res.status(401).json({
      error: 'Autenticação necessária',
      timestamp: new Date().toISOString(),
    });
  }

  // Verifica role de admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Acesso negado. Permissão de administrador necessária.',
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

/**
 * Middleware de rate limiting básico (proteção contra brute force)
 * Implementação em memória. Para produção, use Redis ou serviço externo
 */
const loginAttempts = new Map();
const ATTEMPT_LIMIT = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutos

export function rateLimitMiddleware(req, res, next) {
  const email = req.body?.email;

  if (!email) {
    return next();
  }

  const now = Date.now();
  const userAttempts = loginAttempts.get(email) || [];

  // Remove tentativas fora da janela
  const recentAttempts = userAttempts.filter(time => now - time < ATTEMPT_WINDOW);

  if (recentAttempts.length >= ATTEMPT_LIMIT) {
    return res.status(429).json({
      error: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
      retryAfter: ATTEMPT_WINDOW / 1000,
      timestamp: new Date().toISOString(),
    });
  }

  // Registra tentativa
  recentAttempts.push(now);
  loginAttempts.set(email, recentAttempts);

  next();
}
