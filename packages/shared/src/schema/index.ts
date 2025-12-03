export const typeDefs = `#graphql
  scalar DateTime

  enum Role {
    USER
    ADMIN
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    role: Role!
    avatar: String
    phone: String
    address: String
    city: String
    country: String
    zipCode: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: String
    bookCount: Int!
    books: [Book!]
    createdAt: DateTime!
  }

  type Book {
    id: ID!
    title: String!
    slug: String!
    author: String!
    description: String!
    price: Float!
    originalPrice: Float
    isbn: String!
    publisher: String
    publishedDate: DateTime
    pages: Int
    language: String!
    coverImage: String!
    images: [String!]
    stock: Int!
    sold: Int!
    featured: Boolean!
    isActive: Boolean!
    category: Category
    reviews: [Review!]
    averageRating: Float
    reviewCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BookConnection {
    books: [Book!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
  }

  type CartItem {
    id: ID!
    quantity: Int!
    book: Book!
    subtotal: Float!
  }

  type Cart {
    items: [CartItem!]!
    itemCount: Int!
    subtotal: Float!
    tax: Float!
    shipping: Float!
    total: Float!
  }

  type OrderItem {
    id: ID!
    quantity: Int!
    price: Float!
    book: Book!
  }

  type Order {
    id: ID!
    orderNumber: String!
    status: OrderStatus!
    items: [OrderItem!]!
    subtotal: Float!
    tax: Float!
    shippingCost: Float!
    total: Float!
    shippingAddress: String!
    shippingCity: String!
    shippingCountry: String!
    shippingZipCode: String!
    paymentMethod: String!
    notes: String
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderConnection {
    orders: [Order!]!
    totalCount: Int!
    totalPages: Int!
  }

  type Review {
    id: ID!
    rating: Int!
    title: String
    comment: String!
    isApproved: Boolean!
    user: User!
    book: Book!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Wishlist {
    id: ID!
    book: Book!
    createdAt: DateTime!
  }

  type DashboardStats {
    totalBooks: Int!
    totalUsers: Int!
    totalOrders: Int!
    totalRevenue: Float!
    pendingOrders: Int!
    recentOrders: [Order!]!
    topSellingBooks: [Book!]!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    address: String
    city: String
    country: String
    zipCode: String
  }

  input BookFilters {
    search: String
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    featured: Boolean
    inStock: Boolean
  }

  input CreateBookInput {
    title: String!
    author: String!
    description: String!
    price: Float!
    originalPrice: Float
    isbn: String!
    publisher: String
    publishedDate: DateTime
    pages: Int
    language: String
    coverImage: String!
    images: [String!]
    stock: Int!
    featured: Boolean
    isActive: Boolean
    categoryId: ID!
  }

  input UpdateBookInput {
    title: String
    author: String
    description: String
    price: Float
    originalPrice: Float
    isbn: String
    publisher: String
    publishedDate: DateTime
    pages: Int
    language: String
    coverImage: String
    images: [String!]
    stock: Int
    featured: Boolean
    isActive: Boolean
    categoryId: ID
  }

  input CreateCategoryInput {
    name: String!
    description: String
    image: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    image: String
  }

  input CheckoutInput {
    shippingAddress: String!
    shippingCity: String!
    shippingCountry: String!
    shippingZipCode: String!
    paymentMethod: String!
    notes: String
  }

  input ReviewInput {
    rating: Int!
    title: String
    comment: String!
  }

  type Query {
    # Auth
    me: User

    # Books
    books(page: Int, limit: Int, sortBy: String, sortOrder: String, filters: BookFilters): BookConnection!
    book(slug: String!): Book
    featuredBooks(limit: Int): [Book!]!
    searchBooks(query: String!): [Book!]!

    # Categories
    categories: [Category!]!
    category(slug: String!): Category

    # Cart
    cart: Cart!

    # Orders
    myOrders(page: Int, limit: Int): OrderConnection!
    order(id: ID!): Order

    # Wishlist
    myWishlist: [Wishlist!]!

    # Admin
    adminDashboard: DashboardStats!
    adminUsers(search: String): [User!]!
    adminOrders(page: Int, limit: Int, status: OrderStatus): OrderConnection!
    adminReviews(approved: Boolean): [Review!]!
  }

  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!

    # Cart
    addToCart(bookId: ID!, quantity: Int): Cart!
    updateCartItem(bookId: ID!, quantity: Int!): Cart!
    removeFromCart(bookId: ID!): Cart!
    clearCart: Cart!

    # Orders
    checkout(input: CheckoutInput!): Order!

    # Wishlist
    addToWishlist(bookId: ID!): Wishlist!
    removeFromWishlist(bookId: ID!): Boolean!

    # Reviews
    createReview(bookId: ID!, input: ReviewInput!): Review!
    updateReview(id: ID!, input: ReviewInput!): Review!
    deleteReview(id: ID!): Boolean!

    # Admin - Books
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!

    # Admin - Categories
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    # Admin - Orders
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!

    # Admin - Reviews
    approveReview(id: ID!): Review!

    # Admin - Users
    updateUserRole(id: ID!, role: Role!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
