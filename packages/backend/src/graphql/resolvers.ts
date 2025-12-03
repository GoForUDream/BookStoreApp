import { v4 as uuid } from 'uuid';
import { DateTimeResolver } from 'graphql-scalars';
import { config, type Context, type BookFilters, OrderStatus } from '@bookstore/shared';
import {
  hashPassword,
  comparePassword,
  generateToken,
  requireAuth,
  requireAdmin,
} from '../lib/auth.js';

const slugify = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const resolvers = {
  DateTime: DateTimeResolver,

  User: {
    fullName: (parent: any) => `${parent.firstName} ${parent.lastName}`,
  },

  Book: {
    category: (parent: any, _: any, { prisma }: Context) =>
      prisma.category.findUnique({ where: { id: parent.categoryId } }),
    reviews: (parent: any, _: any, { prisma }: Context) =>
      prisma.review.findMany({
        where: { bookId: parent.id, isApproved: true },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
    averageRating: async (parent: any, _: any, { prisma }: Context) => {
      const result = await prisma.review.aggregate({
        where: { bookId: parent.id, isApproved: true },
        _avg: { rating: true },
      });
      return result._avg.rating;
    },
    reviewCount: (parent: any, _: any, { prisma }: Context) =>
      prisma.review.count({ where: { bookId: parent.id, isApproved: true } }),
  },

  Category: {
    bookCount: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.count({ where: { categoryId: parent.id, isActive: true } }),
    books: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.findMany({ where: { categoryId: parent.id, isActive: true } }),
  },

  CartItem: {
    book: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.findUnique({ where: { id: parent.bookId } }),
    subtotal: async (parent: any, _: any, { prisma }: Context) => {
      const book = await prisma.book.findUnique({ where: { id: parent.bookId } });
      return book ? book.price * parent.quantity : 0;
    },
  },

  OrderItem: {
    book: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.findUnique({ where: { id: parent.bookId } }),
  },

  Order: {
    user: (parent: any, _: any, { prisma }: Context) =>
      prisma.user.findUnique({ where: { id: parent.userId } }),
    items: (parent: any, _: any, { prisma }: Context) =>
      prisma.orderItem.findMany({
        where: { orderId: parent.id },
        include: { book: true },
      }),
  },

  Review: {
    user: (parent: any, _: any, { prisma }: Context) =>
      prisma.user.findUnique({ where: { id: parent.userId } }),
    book: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.findUnique({ where: { id: parent.bookId } }),
  },

  Wishlist: {
    book: (parent: any, _: any, { prisma }: Context) =>
      prisma.book.findUnique({ where: { id: parent.bookId } }),
  },

  Query: {
    me: (_: any, __: any, context: Context) => context.user,

    books: async (
      _: any,
      args: { page?: number; limit?: number; sortBy?: string; sortOrder?: string; filters?: BookFilters },
      { prisma }: Context
    ) => {
      const page = args.page || 1;
      const limit = Math.min(args.limit || config.pagination.defaultLimit, config.pagination.maxLimit);
      const skip = (page - 1) * limit;

      const where: any = { isActive: true };
      if (args.filters?.search) {
        where.OR = [
          { title: { contains: args.filters.search, mode: 'insensitive' } },
          { author: { contains: args.filters.search, mode: 'insensitive' } },
        ];
      }
      if (args.filters?.categoryId) where.categoryId = args.filters.categoryId;
      if (args.filters?.minPrice) where.price = { ...where.price, gte: args.filters.minPrice };
      if (args.filters?.maxPrice) where.price = { ...where.price, lte: args.filters.maxPrice };
      if (args.filters?.featured) where.featured = true;
      if (args.filters?.inStock) where.stock = { gt: 0 };

      const orderBy: any = {};
      orderBy[args.sortBy || 'createdAt'] = args.sortOrder || 'desc';

      const [books, totalCount] = await Promise.all([
        prisma.book.findMany({ where, skip, take: limit, orderBy, include: { category: true } }),
        prisma.book.count({ where }),
      ]);

      return {
        books,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: page * limit < totalCount,
      };
    },

    book: (_: any, { slug }: { slug: string }, { prisma }: Context) =>
      prisma.book.findUnique({ where: { slug }, include: { category: true } }),

    featuredBooks: (_: any, { limit }: { limit?: number }, { prisma }: Context) =>
      prisma.book.findMany({
        where: { featured: true, isActive: true },
        take: limit || 8,
        include: { category: true },
      }),

    searchBooks: (_: any, { query }: { query: string }, { prisma }: Context) =>
      prisma.book.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      }),

    categories: (_: any, __: any, { prisma }: Context) =>
      prisma.category.findMany({ orderBy: { name: 'asc' } }),

    category: (_: any, { slug }: { slug: string }, { prisma }: Context) =>
      prisma.category.findUnique({ where: { slug }, include: { books: { where: { isActive: true } } } }),

    cart: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context);
      const items = await context.prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { book: true },
      });

      const subtotal = items.reduce((sum: number, item: any) => sum + item.book.price * item.quantity, 0);
      const shipping = subtotal >= config.shipping.freeThreshold ? 0 : config.shipping.cost;
      const tax = subtotal * config.tax.rate;

      return {
        items,
        itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
      };
    },

    myOrders: async (_: any, args: { page?: number; limit?: number }, context: Context) => {
      const user = requireAuth(context);
      const page = args.page || 1;
      const limit = args.limit || 10;

      const [orders, totalCount] = await Promise.all([
        context.prisma.order.findMany({
          where: { userId: user.id },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { book: true } } },
        }),
        context.prisma.order.count({ where: { userId: user.id } }),
      ]);

      return { orders, totalCount, totalPages: Math.ceil(totalCount / limit) };
    },

    order: async (_: any, { id }: { id: string }, context: Context) => {
      const user = requireAuth(context);
      const order = await context.prisma.order.findUnique({
        where: { id },
        include: { items: { include: { book: true } }, user: true },
      });
      if (!order || (order.userId !== user.id && user.role !== 'ADMIN')) {
        throw new Error('Order not found');
      }
      return order;
    },

    myWishlist: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context);
      return context.prisma.wishlist.findMany({
        where: { userId: user.id },
        include: { book: { include: { category: true } } },
      });
    },

    adminDashboard: async (_: any, __: any, context: Context) => {
      requireAdmin(context);
      const [totalBooks, totalUsers, totalOrders, revenueResult, pendingOrders, recentOrders, topSellingBooks] =
        await Promise.all([
          context.prisma.book.count(),
          context.prisma.user.count(),
          context.prisma.order.count(),
          context.prisma.order.aggregate({ _sum: { total: true } }),
          context.prisma.order.count({ where: { status: 'PENDING' } }),
          context.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, items: { include: { book: true } } },
          }),
          context.prisma.book.findMany({ take: 5, orderBy: { sold: 'desc' } }),
        ]);

      return {
        totalBooks,
        totalUsers,
        totalOrders,
        totalRevenue: revenueResult._sum.total || 0,
        pendingOrders,
        recentOrders,
        topSellingBooks,
      };
    },

    adminUsers: (_: any, { search }: { search?: string }, context: Context) => {
      requireAdmin(context);
      const where = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};
      return context.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
    },

    adminOrders: async (
      _: any,
      args: { page?: number; limit?: number; status?: OrderStatus },
      context: Context
    ) => {
      requireAdmin(context);
      const page = args.page || 1;
      const limit = args.limit || 10;
      const where = args.status ? { status: args.status } : {};

      const [orders, totalCount] = await Promise.all([
        context.prisma.order.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { user: true, items: { include: { book: true } } },
        }),
        context.prisma.order.count({ where }),
      ]);

      return { orders, totalCount, totalPages: Math.ceil(totalCount / limit) };
    },

    adminReviews: (_: any, { approved }: { approved?: boolean }, context: Context) => {
      requireAdmin(context);
      const where = approved !== undefined ? { isApproved: approved } : {};
      return context.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: true, book: true },
      });
    },
  },

  Mutation: {
    register: async (_: any, { input }: any, { prisma }: Context) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error('Email already registered');

      const user = await prisma.user.create({
        data: { ...input, password: await hashPassword(input.password) },
      });

      return { token: generateToken(user.id), user: { ...user, fullName: `${user.firstName} ${user.lastName}` } };
    },

    login: async (_: any, { email, password }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await comparePassword(password, user.password))) {
        throw new Error('Invalid email or password');
      }

      return { token: generateToken(user.id), user: { ...user, fullName: `${user.firstName} ${user.lastName}` } };
    },

    updateProfile: async (_: any, { input }: any, context: Context) => {
      const user = requireAuth(context);
      const updated = await context.prisma.user.update({ where: { id: user.id }, data: input });
      return { ...updated, fullName: `${updated.firstName} ${updated.lastName}` };
    },

    changePassword: async (_: any, { currentPassword, newPassword }: any, context: Context) => {
      const user = requireAuth(context);
      const dbUser = await context.prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser || !(await comparePassword(currentPassword, dbUser.password))) {
        throw new Error('Current password is incorrect');
      }
      await context.prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(newPassword) },
      });
      return true;
    },

    addToCart: async (_: any, { bookId, quantity = 1 }: any, context: Context) => {
      const user = requireAuth(context);
      const book = await context.prisma.book.findUnique({ where: { id: bookId } });
      if (!book || !book.isActive) throw new Error('Book not found');
      if (book.stock < quantity) throw new Error('Not enough stock');

      await context.prisma.cartItem.upsert({
        where: { userId_bookId: { userId: user.id, bookId } },
        create: { userId: user.id, bookId, quantity },
        update: { quantity: { increment: quantity } },
      });

      return resolvers.Query.cart(null, null, context);
    },

    updateCartItem: async (_: any, { bookId, quantity }: any, context: Context) => {
      const user = requireAuth(context);
      if (quantity <= 0) {
        await context.prisma.cartItem.delete({ where: { userId_bookId: { userId: user.id, bookId } } });
      } else {
        await context.prisma.cartItem.update({
          where: { userId_bookId: { userId: user.id, bookId } },
          data: { quantity },
        });
      }
      return resolvers.Query.cart(null, null, context);
    },

    removeFromCart: async (_: any, { bookId }: any, context: Context) => {
      const user = requireAuth(context);
      await context.prisma.cartItem.delete({ where: { userId_bookId: { userId: user.id, bookId } } });
      return resolvers.Query.cart(null, null, context);
    },

    clearCart: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context);
      await context.prisma.cartItem.deleteMany({ where: { userId: user.id } });
      return resolvers.Query.cart(null, null, context);
    },

    checkout: async (_: any, { input }: any, context: Context) => {
      const user = requireAuth(context);
      const cart = await resolvers.Query.cart(null, null, context);
      if (cart.items.length === 0) throw new Error('Cart is empty');

      const order = await context.prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${uuid().slice(0, 4).toUpperCase()}`,
          userId: user.id,
          subtotal: cart.subtotal,
          tax: cart.tax,
          shippingCost: cart.shipping,
          total: cart.total,
          ...input,
          items: {
            create: cart.items.map((item: any) => ({
              bookId: item.book.id,
              quantity: item.quantity,
              price: item.book.price,
            })),
          },
        },
        include: { items: { include: { book: true } }, user: true },
      });

      // Update stock and sold counts
      for (const item of cart.items) {
        await context.prisma.book.update({
          where: { id: item.book.id },
          data: { stock: { decrement: item.quantity }, sold: { increment: item.quantity } },
        });
      }

      await context.prisma.cartItem.deleteMany({ where: { userId: user.id } });
      return order;
    },

    addToWishlist: async (_: any, { bookId }: any, context: Context) => {
      const user = requireAuth(context);
      return context.prisma.wishlist.create({
        data: { userId: user.id, bookId },
        include: { book: { include: { category: true } } },
      });
    },

    removeFromWishlist: async (_: any, { bookId }: any, context: Context) => {
      const user = requireAuth(context);
      await context.prisma.wishlist.delete({ where: { userId_bookId: { userId: user.id, bookId } } });
      return true;
    },

    createReview: async (_: any, { bookId, input }: any, context: Context) => {
      const user = requireAuth(context);
      return context.prisma.review.create({
        data: { ...input, userId: user.id, bookId },
        include: { user: true, book: true },
      });
    },

    updateReview: async (_: any, { id, input }: any, context: Context) => {
      const user = requireAuth(context);
      const review = await context.prisma.review.findUnique({ where: { id } });
      if (!review || review.userId !== user.id) throw new Error('Review not found');
      return context.prisma.review.update({ where: { id }, data: input, include: { user: true, book: true } });
    },

    deleteReview: async (_: any, { id }: any, context: Context) => {
      const user = requireAuth(context);
      const review = await context.prisma.review.findUnique({ where: { id } });
      if (!review || (review.userId !== user.id && user.role !== 'ADMIN')) throw new Error('Review not found');
      await context.prisma.review.delete({ where: { id } });
      return true;
    },

    createBook: async (_: any, { input }: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.book.create({
        data: { ...input, slug: slugify(input.title) },
        include: { category: true },
      });
    },

    updateBook: async (_: any, { id, input }: any, context: Context) => {
      requireAdmin(context);
      const data = { ...input };
      if (input.title) data.slug = slugify(input.title);
      return context.prisma.book.update({ where: { id }, data, include: { category: true } });
    },

    deleteBook: async (_: any, { id }: any, context: Context) => {
      requireAdmin(context);
      await context.prisma.book.delete({ where: { id } });
      return true;
    },

    createCategory: async (_: any, { input }: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.category.create({ data: { ...input, slug: slugify(input.name) } });
    },

    updateCategory: async (_: any, { id, input }: any, context: Context) => {
      requireAdmin(context);
      const data = { ...input };
      if (input.name) data.slug = slugify(input.name);
      return context.prisma.category.update({ where: { id }, data });
    },

    deleteCategory: async (_: any, { id }: any, context: Context) => {
      requireAdmin(context);
      const bookCount = await context.prisma.book.count({ where: { categoryId: id } });
      if (bookCount > 0) throw new Error('Cannot delete category with books');
      await context.prisma.category.delete({ where: { id } });
      return true;
    },

    updateOrderStatus: async (_: any, { id, status }: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.order.update({
        where: { id },
        data: { status },
        include: { user: true, items: { include: { book: true } } },
      });
    },

    approveReview: async (_: any, { id }: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.review.update({
        where: { id },
        data: { isApproved: true },
        include: { user: true, book: true },
      });
    },

    updateUserRole: async (_: any, { id, role }: any, context: Context) => {
      requireAdmin(context);
      const updated = await context.prisma.user.update({ where: { id }, data: { role } });
      return { ...updated, fullName: `${updated.firstName} ${updated.lastName}` };
    },

    deleteUser: async (_: any, { id }: any, context: Context) => {
      requireAdmin(context);
      await context.prisma.user.delete({ where: { id } });
      return true;
    },
  },
};
