import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-cleanline';

function getTokenFromRequest(req) {
  if (req.cookies?.cleanline_token) {
    return req.cookies.cleanline_token;
  }

  const authorization = req.headers['authorization'];

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  return null;
}

export function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      error: 'Token nao enviado',
      authDebug: {
        hasCookieHeader: Boolean(req.headers.cookie),
        hasParsedCookies: Boolean(req.cookies && Object.keys(req.cookies).length),
        hasCleanlineToken: Boolean(req.cookies?.cleanline_token),
      },
    });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      error: 'Token invalido ou expirado',
      authDebug: {
        hasCleanlineToken: true,
      },
    });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Requer privilegios de Administrador.' });
  }

  next();
}
