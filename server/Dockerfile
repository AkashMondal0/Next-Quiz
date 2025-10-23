FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install -f
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN --mount=type=cache,target=/root/.npm npm install --omit=dev --legacy-peer-deps
RUN apk add --no-cache docker-cli

EXPOSE 4000
CMD [ "npm", "start" ]