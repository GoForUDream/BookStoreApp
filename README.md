# Bookstore App

A modern full-stack e-commerce application built with TypeScript, GraphQL, and React.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-success)](https://github.com/features/actions)
[![Tests](https://img.shields.io/badge/Tests-24_Passing-success)]()
[![Coverage](https://img.shields.io/badge/Coverage-28%25-yellow)]()

---

## 🛠️ Tech Stack

**Backend**
- Node.js, Apollo Server (GraphQL), Prisma ORM 7, PostgreSQL

**Frontend**
- React 18, Vite, TailwindCSS, Material-UI, Apollo Client, Zustand

**DevOps**
- Docker, Docker Compose, Multi-stage builds
- GitHub Actions CI/CD pipeline
- Automated testing (Jest), Code coverage
- Branch protection with required status checks

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
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run db:push` | Sync database schema |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run docker:up` | Start database in Docker (dev) |
| `npm run docker:down` | Stop Docker containers |

## 🔄 CI/CD & Testing

This project includes a **GitHub Actions CI/CD pipeline** for automated testing and deployment workflows.

**CI Pipeline:**
- Automated testing on every Pull Request
- TypeScript type checking & build verification
- 24 unit & integration tests with PostgreSQL
- Docker build validation
- Branch protection (cannot merge if tests fail)

**Branch Strategy:**
- `main` - Production-ready code
- `dev` - Development/integration branch (default)
- `feature/*` - Feature branches (create PRs to dev)

**Running Tests:**
```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
```

## 🌐 Deployment

**Status:** CI configured, CD deployment coming soon (AWS)
