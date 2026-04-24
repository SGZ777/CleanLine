import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-cleanline';

function getTokenFromRequest(req) {
  const authorization = req.headers['authorization'];

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf('=');
        const key = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
        const value = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : '';
        return [key, decodeURIComponent(value)];
      })
  );

  return cookies.cleanline_token || null;
}

export function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: 'Token nao enviado' });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Requer privilegios de Administrador.' });
  }

  next();
}
