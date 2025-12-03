# Bookstore App

A modern full-stack e-commerce application built with TypeScript, GraphQL, and React.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

## 🛠️ Tech Stack

**Backend**
- Node.js, Apollo Server (GraphQL), Prisma ORM 7, PostgreSQL

**Frontend**
- React 18, Vite, TailwindCSS, Material-UI, Apollo Client, Zustand

**DevOps**
- Docker, Docker Compose, Multi-stage builds, GitHub Actions (CI/CD)

## 📁 Project Structure

```
bookstore-app/
├── packages/
│   ├── backend/         # GraphQL API server
│   ├── frontend/        # React SPA
│   └── shared/          # Shared types & schema
├── docker-compose.yml
└── .github/workflows/   # CI/CD pipelines
```

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# Clone and start
git clone <your-repo-url>
cd bookstore-app
docker-compose up

# Access the app at http://localhost:3000
# Sample data is seeded automatically!
```

### Local Development

**Prerequisites:** Node.js 18+, Docker

```bash
npm install
npm run setup    # Installs deps, starts DB, runs migrations, seeds data
npm run dev      # Start development servers
```

---

## ✨ Features

**Customer Features**
- Browse & search books with advanced filters
- Shopping cart & checkout
- Order history & tracking
- Wishlist management
- User reviews & ratings

**Admin Dashboard**
- Analytics & sales metrics
- Book & category management
- Order processing
- User & review moderation

## 🔐 Demo Credentials

| Role  | Email                | Password  |
|-------|---------------------|-----------|
| Admin | admin@bookstore.com | admin123  |
| User  | user@bookstore.com  | user123   |

## 🐳 Docker

**Common Commands:**
```bash
docker-compose up              # Start all services
docker-compose up -d           # Start in background
docker-compose down            # Stop all services
docker-compose down -v         # Stop and remove data
docker-compose logs -f         # View logs
docker-compose build           # Rebuild images
```

**Architecture:**
- Multi-stage builds for optimized production images
- Health checks & service dependencies
- Persistent volumes for database
- Nginx for frontend serving

## 📋 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build all packages |
| `npm run db:push` | Sync database schema |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## 🌐 Deployment

*Coming soon: CI/CD pipeline, cloud deployment, monitoring*
