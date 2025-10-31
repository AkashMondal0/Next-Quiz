FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

EXPOSE 4000
CMD ["node", "dist/main.js"]