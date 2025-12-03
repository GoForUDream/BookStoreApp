import { gql } from '@apollo/client';

// Fragments
const BOOK_FRAGMENT = gql`
  fragment BookFields on Book {
    id
    title
    slug
    author
    description
    price
    originalPrice
    isbn
    publisher
    pages
    language
    coverImage
    stock
    sold
    featured
    isActive
    averageRating
    reviewCount
    category {
      id
      name
      slug
    }
  }
`;

const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    fullName
    role
    avatar
    phone
    address
    city
    country
    zipCode
    createdAt
  }
`;

// Auth
export const ME_QUERY = gql`
  ${USER_FRAGMENT}
  query Me {
    me {
      ...UserFields
    }
  }
`;

export const LOGIN_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFields
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

// Books
export const BOOKS_QUERY = gql`
  ${BOOK_FRAGMENT}
  query Books($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $filters: BookFilters) {
    books(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, filters: $filters) {
      books {
        ...BookFields
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;

export const BOOK_QUERY = gql`
  ${BOOK_FRAGMENT}
  query Book($slug: String!) {
    book(slug: $slug) {
      ...BookFields
      reviews {
        id
        rating
        title
        comment
        createdAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const FEATURED_BOOKS_QUERY = gql`
  ${BOOK_FRAGMENT}
  query FeaturedBooks($limit: Int) {
    featuredBooks(limit: $limit) {
      ...BookFields
    }
  }
`;

// Categories
export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
      description
      image
      bookCount
    }
  }
`;

export const CATEGORY_QUERY = gql`
  ${BOOK_FRAGMENT}
  query Category($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      books {
        ...BookFields
      }
    }
  }
`;

// Cart
export const CART_QUERY = gql`
  query Cart {
    cart {
      items {
        id
        quantity
        subtotal
        book {
          id
          title
          slug
          author
          price
          coverImage
          stock
        }
      }
      itemCount
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($bookId: ID!, $quantity: Int) {
    addToCart(bookId: $bookId, quantity: $quantity) {
      items {
        id
        quantity
        subtotal
        book {
          id
          title
          slug
          author
          price
          coverImage
          stock
        }
      }
      itemCount
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItem($bookId: ID!, $quantity: Int!) {
    updateCartItem(bookId: $bookId, quantity: $quantity) {
      items {
        id
        quantity
        subtotal
        book {
          id
          title
          slug
          author
          price
          coverImage
          stock
        }
      }
      itemCount
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($bookId: ID!) {
    removeFromCart(bookId: $bookId) {
      items {
        id
        quantity
        subtotal
        book {
          id
          title
          slug
          author
          price
          coverImage
          stock
        }
      }
      itemCount
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart {
      items {
        id
      }
      itemCount
      subtotal
      tax
      shipping
      total
    }
  }
`;

// Orders
export const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      id
      orderNumber
      status
      total
    }
  }
`;

export const MY_ORDERS_QUERY = gql`
  query MyOrders($page: Int, $limit: Int) {
    myOrders(page: $page, limit: $limit) {
      orders {
        id
        orderNumber
        status
        total
        createdAt
        items {
          id
          quantity
          price
          book {
            id
            title
            coverImage
          }
        }
      }
      totalCount
      totalPages
    }
  }
`;

export const ORDER_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      subtotal
      tax
      shippingCost
      total
      shippingAddress
      shippingCity
      shippingCountry
      shippingZipCode
      paymentMethod
      notes
      createdAt
      items {
        id
        quantity
        price
        book {
          id
          title
          slug
          author
          coverImage
        }
      }
    }
  }
`;

// Wishlist
export const WISHLIST_QUERY = gql`
  ${BOOK_FRAGMENT}
  query MyWishlist {
    myWishlist {
      id
      book {
        ...BookFields
      }
    }
  }
`;

export const ADD_TO_WISHLIST_MUTATION = gql`
  mutation AddToWishlist($bookId: ID!) {
    addToWishlist(bookId: $bookId) {
      id
    }
  }
`;

export const REMOVE_FROM_WISHLIST_MUTATION = gql`
  mutation RemoveFromWishlist($bookId: ID!) {
    removeFromWishlist(bookId: $bookId)
  }
`;

// Reviews
export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($bookId: ID!, $input: ReviewInput!) {
    createReview(bookId: $bookId, input: $input) {
      id
      rating
      title
      comment
    }
  }
`;

// Admin
export const ADMIN_DASHBOARD_QUERY = gql`
  query AdminDashboard {
    adminDashboard {
      totalBooks
      totalUsers
      totalOrders
      totalRevenue
      pendingOrders
      recentOrders {
        id
        orderNumber
        status
        total
        createdAt
        user {
          firstName
          lastName
        }
      }
      topSellingBooks {
        id
        title
        author
        coverImage
        sold
      }
    }
  }
`;

export const ADMIN_USERS_QUERY = gql`
  ${USER_FRAGMENT}
  query AdminUsers($search: String) {
    adminUsers(search: $search) {
      ...UserFields
    }
  }
`;

export const ADMIN_ORDERS_QUERY = gql`
  query AdminOrders($page: Int, $limit: Int, $status: OrderStatus) {
    adminOrders(page: $page, limit: $limit, status: $status) {
      orders {
        id
        orderNumber
        status
        total
        createdAt
        user {
          id
          firstName
          lastName
          email
        }
        items {
          id
          quantity
          price
          book {
            id
            title
            coverImage
          }
        }
      }
      totalCount
      totalPages
    }
  }
`;

export const ADMIN_REVIEWS_QUERY = gql`
  query AdminReviews($approved: Boolean) {
    adminReviews(approved: $approved) {
      id
      rating
      title
      comment
      isApproved
      createdAt
      user {
        id
        firstName
        lastName
        email
      }
      book {
        id
        title
      }
    }
  }
`;

// Admin mutations
export const CREATE_BOOK_MUTATION = gql`
  ${BOOK_FRAGMENT}
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      ...BookFields
    }
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  ${BOOK_FRAGMENT}
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      ...BookFields
    }
  }
`;

export const DELETE_BOOK_MUTATION = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const APPROVE_REVIEW_MUTATION = gql`
  mutation ApproveReview($id: ID!) {
    approveReview(id: $id) {
      id
      isApproved
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const UPDATE_USER_ROLE_MUTATION = gql`
  mutation UpdateUserRole($id: ID!, $role: Role!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
