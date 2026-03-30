import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; plan: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('[AUTH ERROR] Header de autorização ausente ou indefinido:', req.headers);
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.error('[AUTH ERROR] Token mal formatado:', authHeader);
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    console.error('[AUTH ERROR] Esquema do token não é Bearer:', scheme);
    return res.status(401).json({ error: 'Esquema de token inválido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.error('[AUTH ERROR] Assinatura do Token inválida ou token expirado:', token);
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.user = decoded;
  next();
};
