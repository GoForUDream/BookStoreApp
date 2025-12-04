# Stage 1: Build React app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies (frontend + shared)
RUN npm ci --workspace=@bookstore/frontend --workspace=@bookstore/shared

# Copy TypeScript config (needed for builds)
COPY tsconfig.json ./

# Copy source code
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

# Build shared package first (frontend depends on it)
WORKDIR /app/packages/shared
RUN npm run build

# Build the app
WORKDIR /app/packages/frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]