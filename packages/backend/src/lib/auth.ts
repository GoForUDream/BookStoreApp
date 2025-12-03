import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config, type User, type Context } from '@bookstore/shared';
import { prisma } from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: config.jwt.expiresIn });
};

export const getUserFromToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) return null;
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    } as any as User;
  } catch {
    return null;
  }
};

export const requireAuth = (context: Context): User => {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

export const requireAdmin = (context: Context): User => {
  const user = requireAuth(context);
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
};
