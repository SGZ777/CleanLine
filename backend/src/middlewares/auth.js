import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-cleanline';

export function authMiddleware(req, res, next) {
  const authorization = req.headers['authorization'];

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token nao enviado' });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}
