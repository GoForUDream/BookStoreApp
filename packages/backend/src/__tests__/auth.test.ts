import jwt from 'jsonwebtoken';
import {
  hashPassword,
  comparePassword,
  generateToken,
  requireAuth,
  requireAdmin,
} from '../lib/auth.js';
import { Context } from '@bookstore/shared';

describe('Auth Module', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'myPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should create different hashes for same password', async () => {
      const password = 'myPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // bcrypt uses salt
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'myPassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'myPassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword('wrongPassword', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'test-user-id-123';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId in token payload', () => {
      const userId = 'test-user-id-123';
      const token = generateToken(userId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

      expect(decoded.userId).toBe(userId);
    });

    it('should have expiration time', () => {
      const userId = 'test-user-id-123';
      const token = generateToken(userId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { exp: number };

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('requireAuth', () => {
    it('should return user if authenticated', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'USER' as const,
        firstName: 'Test',
        lastName: 'User',
      };

      const context: Context = { user: mockUser } as Context;
      const result = requireAuth(context);

      expect(result).toBe(mockUser);
    });

    it('should throw error if not authenticated', () => {
      const context: Context = { user: null } as Context;

      expect(() => requireAuth(context)).toThrow('Authentication required');
    });
  });

  describe('requireAdmin', () => {
    it('should return user if admin', () => {
      const mockAdmin = {
        id: '1',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
        firstName: 'Admin',
        lastName: 'User',
      };

      const context: Context = { user: mockAdmin } as Context;
      const result = requireAdmin(context);

      expect(result).toBe(mockAdmin);
    });

    it('should throw error if not admin', () => {
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        role: 'USER' as const,
        firstName: 'Regular',
        lastName: 'User',
      };

      const context: Context = { user: mockUser } as Context;

      expect(() => requireAdmin(context)).toThrow('Admin access required');
    });

    it('should throw error if not authenticated', () => {
      const context: Context = { user: null } as Context;

      expect(() => requireAdmin(context)).toThrow('Authentication required');
    });
  });
});
