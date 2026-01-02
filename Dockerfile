# Stage 1: build
FROM node:22-slim AS builder
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build:api

# Stage 2: runtime
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what’s needed to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Cloud Run/Serverless listens on $PORT
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]