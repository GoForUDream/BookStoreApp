// Enums
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Base types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  bookCount: number;
  books?: Book[];
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isbn: string;
  publisher?: string | null;
  publishedDate?: string | null;
  pages?: number | null;
  language: string;
  coverImage: string;
  images?: string[];
  stock: number;
  sold: number;
  featured: boolean;
  isActive: boolean;
  category?: Category | null;
  reviews?: Review[];
  averageRating?: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookConnection {
  books: Book[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  book: Book;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: Book;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZipCode: string;
  paymentMethod: string;
  notes?: string | null;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface OrderConnection {
  orders: Order[];
  totalCount: number;
  totalPages: number;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  isApproved: boolean;
  user: User;
  book: Book;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  book: Book;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: Order[];
  topSellingBooks: Book[];
}

// Input types
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}

export interface BookFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  isbn: string;
  publisher?: string;
  publishedDate?: string;
  pages?: number;
  language?: string;
  coverImage: string;
  images?: string[];
  stock: number;
  featured?: boolean;
  isActive?: boolean;
  categoryId: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  isbn?: string;
  publisher?: string;
  publishedDate?: string;
  pages?: number;
  language?: string;
  coverImage?: string;
  images?: string[];
  stock?: number;
  featured?: boolean;
  isActive?: boolean;
  categoryId?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string;
}

export interface CheckoutInput {
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZipCode: string;
  paymentMethod: string;
  notes?: string;
}

export interface ReviewInput {
  rating: number;
  title?: string;
  comment: string;
}

// Context type for resolvers
export interface Context {
  user?: User | null;
  prisma: any;
}
