FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
# Directorio para imágenes subidas; se sobreescribe por el volumen Docker en runtime
ENV UPLOADS_DIR /app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Crear el directorio de uploads y asignar permisos al usuario node (UID 1000)
# El volumen Docker se monta aquí: las imágenes persisten entre reinicios
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Usar usuario no-root por seguridad
USER node

EXPOSE 3000
CMD ["node", "server.js"]
