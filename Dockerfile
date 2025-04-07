# Builder Stage
FROM node:20 AS builder

# Install native dependencies required by sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim

# Install runtime dependencies required by sharp
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libjpeg62-turbo \
    libpango-1.0-0 \
    libgif7 \
    librsvg2-2 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Only copy necessary files to keep the image lean
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build from builder
COPY --from=builder /app .

# Ensure the public/uploads folder exists
RUN mkdir -p /app/public/uploads

EXPOSE 1337

CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
