# Bookstore App

A full-stack bookstore application built with TypeScript monorepo architecture.

## Tech Stack

- **Backend**: Node.js, Apollo Server, GraphQL, Prisma, PostgreSQL
- **Frontend**: React, Vite, TailwindCSS, Material-UI, Apollo Client, Zustand
- **Shared**: TypeScript types, GraphQL schema, configuration
- **Database**: PostgreSQL (Docker)

## Project Structure

```
bookstore-app/
├── packages/
│   ├── shared/          # Shared types, schema, config
│   ├── backend/         # GraphQL API server
│   └── frontend/        # React application
├── docker-compose.yml   # PostgreSQL container
└── package.json         # Workspace configuration
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm 9+

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start PostgreSQL database**
   ```bash
   npm run docker:up
   ```

3. **Setup database and seed data**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

Or run the complete setup in one command:
```bash
npm run setup
```

## Access Points

- **Frontend**: http://localhost:3000
- **GraphQL API**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## Demo Credentials

| Role  | Email                | Password  |
|-------|---------------------|-----------|
| Admin | admin@bookstore.com | admin123  |
| User  | user@bookstore.com  | user123   |

## Available Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start both backend and frontend      |
| `npm run docker:up`| Start PostgreSQL container           |
| `npm run docker:down`| Stop PostgreSQL container          |
| `npm run db:push`  | Push schema to database              |
| `npm run db:seed`  | Seed database with sample data       |
| `npm run db:studio`| Open Prisma Studio                   |
| `npm run setup`    | Full setup (install + db + seed)     |

## Features

### Shop
- Browse books with filters (search, category, price, featured)
- Book detail pages with reviews
- Shopping cart
- Checkout process
- Order history
- Wishlist
- User profile management

### Admin
- Dashboard with stats
- Book management (CRUD)
- Category management
- Order management with status updates
- User management with role assignment
- Review moderation

## Environment Variables

Backend `.env` (already configured for local development):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookstore"
JWT_SECRET="dev-secret-key-change-in-production"
```

## Stopping the App

```bash
npm run docker:down
```

This will stop the PostgreSQL container. Data is persisted in a Docker volume.
