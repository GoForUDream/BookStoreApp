#Stage 1: Build
FROM node:22-alpine AS builder

#Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

#Set working directory
WORKDIR /app

#Copy workspace root package files
COPY package*.json ./

#Copy all package.json files for workspace dependencies
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

#Install all dependencies for workspace
RUN npm ci

#Copy tsconfig from root
COPY tsconfig.json ./

#Copy source code
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

# Generate Prisma Client
WORKDIR /app/packages/backend
RUN npx prisma generate

#Build shared package
WORKDIR /app/packages/shared
RUN npm run build || true

#Build backend Typescript
WORKDIR /app/packages/backend
RUN npm run build

#Stage 2: Production
FROM node:22-alpine AS production

RUN apk add --no-cache python3 make g++

WORKDIR /app

#Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

#Install only production dependencies (including shared workspace)
RUN npm ci --workspace=@bookstore/backend --workspace=@bookstore/shared --omit=dev

#Copy built files from builder stage
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder /app/packages/backend/prisma.config.ts ./packages/backend/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

#Expose port
EXPOSE 4000

#Run the app
WORKDIR /app/packages/backend
CMD ["node", "dist/index.js"]