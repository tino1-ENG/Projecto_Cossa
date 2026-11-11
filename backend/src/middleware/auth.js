import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'mozbid_super_secret_jwt_key_2026';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id }).lean();
    
    if (!user) {
      return res.status(401).json({ message: 'Utilizador não encontrado ou sessão inválida' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou inválido', error: err.message });
  }
}

export async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findOne({ id: decoded.id }).lean();

      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token failure for optional auth
    }
  }
  next();
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Acesso não autenticado' });
    }
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Não tem permissão para aceder a este recurso' });
    }
    next();
  };
}
