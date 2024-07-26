FROM node:alpine AS development
WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

EXPOSE 5173

