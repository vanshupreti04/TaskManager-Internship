import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

export function signJwtToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}