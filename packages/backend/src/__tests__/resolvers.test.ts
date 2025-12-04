import { resolvers } from '../graphql/resolvers.js';
import { Context } from '@bookstore/shared';
import * as auth from '../lib/auth.js';

// Mock Prisma
jest.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      create: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    wishlist: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('GraphQL Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.me', () => {
    it('should return current user when authenticated', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'USER' as const,
        firstName: 'Test',
        lastName: 'User',
      };

      const context: Context = { user: mockUser, prisma } as Context;
      const result = resolvers.Query.me(null, {}, context);

      expect(result).toBe(mockUser);
    });

    it('should return null when not authenticated', async () => {
      const { prisma } = require('../lib/prisma.js');
      const context: Context = { user: null, prisma } as Context;

      const result = resolvers.Query.me(null, {}, context);
      expect(result).toBeNull();
    });
  });

  describe('Mutation.login', () => {
    it('should return token and user for valid credentials', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await auth.hashPassword('password123'),
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await resolvers.Mutation.login(
        null,
        { email: 'test@example.com', password: 'password123' },
        { prisma } as Context
      );

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error for invalid email', async () => {
      const { prisma } = require('../lib/prisma.js');
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        resolvers.Mutation.login(
          null,
          { email: 'wrong@example.com', password: 'password123' },
          { prisma } as Context
        )
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await auth.hashPassword('password123'),
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        resolvers.Mutation.login(
          null,
          { email: 'test@example.com', password: 'wrongpassword' },
          { prisma } as Context
        )
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('Mutation.register', () => {
    it('should create new user and return token', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockInput = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const mockCreatedUser = {
        id: '1',
        ...mockInput,
        password: await auth.hashPassword(mockInput.password),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null); // Email doesn't exist
      prisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await resolvers.Mutation.register(null, { input: mockInput }, { prisma } as Context);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('newuser@example.com');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockInput = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      prisma.user.findUnique.mockResolvedValue({ id: '1', email: mockInput.email });

      await expect(
        resolvers.Mutation.register(null, { input: mockInput }, { prisma } as Context)
      ).rejects.toThrow('Email already');
    });
  });

  describe('Cart Logic', () => {
    describe('Query.cart', () => {
      it('should return user cart with items', async () => {
        const { prisma } = require('../lib/prisma.js');
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          role: 'USER' as const,
        };

        const mockCartItems = [
          {
            id: '1',
            userId: '1',
            bookId: 'book1',
            quantity: 2,
            book: {
              id: 'book1',
              title: 'Test Book',
              price: 19.99,
              coverImage: 'image.jpg',
              author: 'Author',
              stock: 10,
            },
          },
        ];

        prisma.cartItem.findMany.mockResolvedValue(mockCartItems);
        prisma.cartItem.count.mockResolvedValue(1);

        const context: Context = { user: mockUser, prisma } as Context;
        const result = await resolvers.Query.cart(null, {}, context);

        expect(result.items).toHaveLength(1);
        expect(result.itemCount).toBe(2); // quantity
        expect(result.subtotal).toBe(39.98); // 2 * 19.99
      });

      it('should calculate tax and total correctly', async () => {
        const { prisma } = require('../lib/prisma.js');
        const mockUser = { id: '1', role: 'USER' as const };

        const mockCartItems = [
          {
            quantity: 1,
            book: { price: 100 },
          },
        ];

        prisma.cartItem.findMany.mockResolvedValue(mockCartItems);
        prisma.cartItem.count.mockResolvedValue(1);

        const context: Context = { user: mockUser, prisma } as Context;
        const result = await resolvers.Query.cart(null, {}, context);

        expect(result.subtotal).toBe(100);
        expect(result.tax).toBe(10); // 10% tax
        expect(result.shipping).toBe(0); // Over $50, free shipping
        expect(result.total).toBe(110); // 100 + 10 + 0
      });

      it('should add shipping cost for orders under $50', async () => {
        const { prisma } = require('../lib/prisma.js');
        const mockUser = { id: '1', role: 'USER' as const };

        const mockCartItems = [
          {
            quantity: 1,
            book: { price: 30 },
          },
        ];

        prisma.cartItem.findMany.mockResolvedValue(mockCartItems);
        prisma.cartItem.count.mockResolvedValue(1);

        const context: Context = { user: mockUser, prisma } as Context;
        const result = await resolvers.Query.cart(null, {}, context);

        expect(result.subtotal).toBe(30);
        expect(result.shipping).toBe(5.99); // Under $50
        expect(result.total).toBe(30 + 3 + 5.99); // subtotal + tax + shipping
      });
    });
  });

  describe('Authorization', () => {
    it('should allow admin to create book', async () => {
      const { prisma } = require('../lib/prisma.js');
      const mockAdmin = {
        id: '1',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
      };

      const mockBookInput = {
        title: 'New Book',
        author: 'Author Name',
        price: 29.99,
        categoryId: 'cat1',
        description: 'A great book',
        isbn: '1234567890',
        stock: 100,
      };

      const mockCreatedBook = {
        id: 'book1',
        ...mockBookInput,
        slug: 'new-book',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.book.create.mockResolvedValue(mockCreatedBook);

      const context: Context = { user: mockAdmin, prisma } as Context;
      const result = await resolvers.Mutation.createBook(null, { input: mockBookInput }, context);

      expect(result.title).toBe('New Book');
      expect(prisma.book.create).toHaveBeenCalled();
    });

    it('should prevent non-admin from creating book', async () => {
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        role: 'USER' as const,
      };

      const mockBookInput = {
        title: 'New Book',
        author: 'Author Name',
        price: 29.99,
        categoryId: 'cat1',
        description: 'A great book',
        isbn: '1234567890',
        stock: 100,
      };

      const { prisma } = require('../lib/prisma.js');
      const context: Context = { user: mockUser, prisma } as Context;

      await expect(
        resolvers.Mutation.createBook(null, { input: mockBookInput }, context)
      ).rejects.toThrow('Admin access required');
    });
  });
});
