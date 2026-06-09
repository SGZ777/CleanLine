import jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET = 'fdbhjeanuivreauvreuif4ui398f389f3ivojdcnjkvdnjksad@@fdfsfsmmhmjsfsdvxcxcvx';

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

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
      error: 'Token não enviado',
      authDebug: {
        hasCookieHeader: Boolean(req.headers.cookie),
        hasParsedCookies: Boolean(req.cookies && Object.keys(req.cookies).length),
        hasCleanlineToken: Boolean(req.cookies?.cleanline_token),
      },
    });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    next();
  } catch (error) {
    // ESSA LINHA NO SEU CONSOLE VAI DIZER O ERRO REAL (JsonWebTokenError ou TokenExpiredError)
    console.error("ERRO NA VERIFICAÇÃO DO JWT:", error.message);

    return res.status(401).json({
      error: 'Token invalido ou expirado',
      reason: error.message, // Envia para o Android o motivo real
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
