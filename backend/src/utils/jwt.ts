import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecret_dev_token';

export const generateToken = (payload: { id: string, plan: string }) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
