# Etapa 1: Build - Compilar la aplicación
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar el código fuente
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Producción - Servir la aplicación con nginx
FROM nginx:alpine AS production

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx para soporte de SPA/React Router
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
