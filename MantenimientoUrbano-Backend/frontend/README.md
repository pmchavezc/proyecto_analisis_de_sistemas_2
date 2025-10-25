# Mantenimiento Urbano - Frontend

Sistema de gestión de mantenimiento urbano con **arquitectura modular basada en componentes**, construido con React + TypeScript + Vite, que consume APIs REST mediante Axios.

## 🎯 Características Principales

✅ **Arquitectura Modular No Monolítica**
- Separación por capas: Presentación, Servicios, Transformación y Comunicación
- Componentes reutilizables y desacoplados
- Servicios centralizados para consumo de APIs
- Mappers para transformación de datos

✅ **Integración con Backend REST API**
- Consumo de endpoints con Axios
- Manejo robusto de estados (loading, error, success)
- Transformación automática de datos API → UI
- Configuración centralizada de HTTP client

## 🛠️ Tecnologías principales
- Node.js + npm
- Vite (dev server y build)
- React 19 + TypeScript
- **Axios** - Cliente HTTP para consumo de APIs REST
- Tailwind CSS + PostCSS
- Lucide React - Iconografía
- Nginx (en la imagen de producción con Docker)

## 📋 Requisitos previos
- Git
- Node.js 18+ y npm (recomendado Node 20)
- Docker y docker-compose (si vas a usar la opción con Docker)
- **Backend API corriendo en `http://localhost:8080`** (para funcionalidad completa)

## 1) Clonar el repositorio

Abre una terminal y ejecuta:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd Front-Mantenimiento-Urbano
```

Reemplaza `<URL_DEL_REPOSITORIO>` por la URL de tu repo (HTTPS o SSH).

## 2) Instalar dependencias

En la carpeta del proyecto ejecuta:

```powershell
npm ci
```

Si usas npm > 9 y no tienes `package-lock.json` en el repo, puedes usar `npm install`.

## 3) Ejecutar en modo desarrollo (local)

Esto lanza el servidor de desarrollo de Vite con Hot Module Replacement (HMR).

```powershell
npm run dev
```

Por defecto Vite suele usar el puerto `5173` (la terminal mostrará el puerto exacto). Abre la URL que muestra Vite en tu navegador.

## 4) Build de producción y previsualizar localmente

Genera los archivos optimizados en `dist`:

```powershell
npm run build
```

Para previsualizar el build con Vite (útil para pruebas locales):

```powershell
npm run preview
```

## 5) Ejecutar con Docker (producción)

El proyecto incluye un `Dockerfile` multi-stage que compila la app y la sirve con Nginx. También hay un `docker-compose.yml` para facilitar el despliegue.

**Nota:** Los archivos Docker están organizados en la carpeta `docker/`.

Construir la imagen y ejecutar con docker-compose:

```powershell
# Construir y levantar el servicio (mapea el puerto 3000 del host al 80 del container)
docker-compose -f docker/docker-compose.yml up --build -d
```

Después de levantar los contenedores, abre http://localhost:3000 en tu navegador.

### Comandos Docker útiles
- Ver logs: `docker-compose -f docker/docker-compose.yml logs -f`
- Detener y borrar contenedores: `docker-compose -f docker/docker-compose.yml down`
- Ver imágenes: `docker images`

### Notas sobre la configuración Docker
- El `Dockerfile` usa Node 20 para compilar y Nginx para servir los archivos estáticos.
- `docker-compose.yml` expone el puerto `80` del contenedor en el puerto `3000` del host (puedes cambiarlo si es necesario).

## 6) Sugerencias para despliegue en remoto

- Plataforma VPS: puedes construir la imagen en el servidor o subir la imagen a un registry (Docker Hub, GitHub Container Registry) y usar `docker-compose pull` + `docker-compose up -d`.
- Plataformas PaaS (por ejemplo DigitalOcean App Platform, Railway): la mayoría permiten desplegar directamente desde el repositorio o desde una imagen Docker.
- Si usas CI/CD (GitHub Actions), añade un workflow que construya y publique la imagen a un registry y despliegue en tu servidor.

## 7) Estructura del proyecto (Arquitectura Modular)

```
Front-Mantenimiento-Urbano/
├── docker/                    # Archivos Docker (deployment)
│   ├── Dockerfile             # Multi-stage build (Node + Nginx)
│   ├── .dockerignore          # Archivos ignorados en build Docker
│   ├── docker-compose.yml     # Orquestación de contenedores
│   └── nginx.conf             # Configuración de Nginx para producción
│
├── public/                    # Archivos estáticos públicos
│   └── vite.svg
│
├── src/                       # 🎯 Código fuente - ARQUITECTURA MODULAR
│   │
│   ├── api/                   # 🔵 CAPA DE COMUNICACIÓN
│   │   ├── axios.ts           # Configuración de Axios (baseURL, interceptores)
│   │   └── requestsService.ts # Servicios para consumir endpoints REST
│   │
│   ├── components/            # 🎨 CAPA DE PRESENTACIÓN - Componentes Reutilizables
│   │   ├── Header.tsx         # Encabezado de la aplicación
│   │   ├── Sidebar.tsx        # Menú lateral de navegación
│   │   ├── StatsCard.tsx      # Tarjetas de estadísticas
│   │   └── RequestsTable.tsx  # Tabla de solicitudes (presentacional)
│   │
│   ├── pages/                 # 🖼️ CAPA DE PRESENTACIÓN - Vistas/Páginas
│   │   ├── Login.tsx          # Vista de autenticación
│   │   ├── Dashboard.tsx      # Panel principal con estadísticas
│   │   ├── RequestsList.tsx   # Lista de solicitudes (conectada a API)
│   │   └── RegisterRequest.tsx # Formulario de registro de solicitudes
│   │
│   ├── types/                 # 📐 DEFINICIONES DE TIPOS
│   │   └── index.ts           # Interfaces TypeScript (ApiRequest, Request, Stats, User)
│   │
│   ├── utils/                 # 🔄 CAPA DE TRANSFORMACIÓN
│   │   └── mappers.ts         # Funciones de transformación de datos (API → UI)
│   │
│   ├── data/                  # 📊 DATOS MOCK (legacy/desarrollo)
│   │   └── mockData.ts        # Datos de prueba (ya no usado en producción)
│   │
│   ├── assets/                # 🎨 Recursos estáticos
│   │   └── react.svg          # Imágenes, iconos, etc.
│   │
│   ├── App.tsx                # 🏠 Componente raíz con routing y estado global
│   ├── App.css                # Estilos del componente principal
│   ├── main.tsx               # 🚀 Punto de entrada de la aplicación
│   └── index.css              # Estilos globales + Tailwind CSS
│
├── eslint.config.js           # Configuración de ESLint
├── tailwind.config.cjs        # Configuración de Tailwind CSS
├── postcss.config.cjs         # Configuración de PostCSS
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # Configuración TypeScript (raíz)
├── tsconfig.app.json          # Configuración TypeScript (app)
├── tsconfig.node.json         # Configuración TypeScript (node)
├── package.json               # Dependencias y scripts npm
├── package-lock.json          # Lock de versiones (versionado)
├── .gitignore                 # Archivos ignorados por Git
└── README.md                  # Este archivo
```

### 🏗️ Arquitectura en Capas

El proyecto sigue el patrón de **separación de responsabilidades**:

```
┌─────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (pages/ + components/) │
│  • Componentes React                         │
│  • Manejo de estado local (useState)         │
│  • Renderizado condicional                   │
│  • Efectos de carga (useEffect)              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CAPA DE TRANSFORMACIÓN (utils/)             │
│  • Mappers de datos                          │
│  • Funciones de utilidad                     │
│  • Conversión API ↔ UI                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CAPA DE SERVICIOS (api/requestsService)     │
│  • Lógica de negocio                         │
│  • Métodos CRUD                               │
│  • Centralización de endpoints               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CAPA DE COMUNICACIÓN (api/axios)            │
│  • Configuración HTTP                        │
│  • Interceptores                             │
│  • Manejo de errores global                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
              [Backend API]
```

## 8) Archivos importantes

### 🔧 Configuración del Proyecto
- `package.json` - Dependencias y scripts npm: `dev`, `build`, `preview`, `lint`
- `vite.config.ts` - Configuración del bundler Vite
- `tsconfig.json` - Configuración TypeScript (raíz del proyecto)
- `eslint.config.js` - Reglas de linting para código limpio
- `tailwind.config.cjs` - Configuración de Tailwind CSS
- `postcss.config.cjs` - Configuración de PostCSS

### 🌐 Integración con API (Nuevos archivos)
- `src/api/axios.ts` - ⭐ Configuración centralizada de Axios (baseURL, timeout, interceptores)
- `src/api/requestsService.ts` - ⭐ Servicios para consumir endpoints REST
- `src/utils/mappers.ts` - ⭐ Transformación de datos entre API y UI
- `src/types/index.ts` - Definiciones TypeScript (ApiRequest, Request, Stats, User)

### 🎨 Componentes Principales
- `src/App.tsx` - Componente raíz con routing y estado global
- `src/pages/RequestsList.tsx` - Lista de solicitudes (conectada a API REST)
- `src/pages/Dashboard.tsx` - Panel de control con estadísticas
- `src/components/` - Componentes reutilizables (Header, Sidebar, StatsCard, RequestsTable)

### 🐳 Docker y Producción
- `docker/Dockerfile` - Multi-stage build (Node para compilar + Nginx para servir)
- `docker/docker-compose.yml` - Orquestación de contenedores (puerto 3000)
- `docker/nginx.conf` - Configuración de Nginx con soporte para React Router, gzip y caché


## 9) Configuración de la API Backend

### 🔗 URL del Backend
Por defecto, el frontend consume el backend en:
```
http://localhost:8080/api
```

### ⚙️ Cambiar la URL de la API
Edita el archivo `src/api/axios.ts`:

```typescript
// src/api/axios.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 👈 Cambia esta URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 🌍 Variables de Entorno (Recomendado)
Para diferentes ambientes (desarrollo, staging, producción):

1. Crea un archivo `.env.local`:
```env
VITE_API_URL=http://localhost:8080/api
```

2. Modifica `src/api/axios.ts`:
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  // ...
});
```

3. Para producción, crea `.env.production`:
```env
VITE_API_URL=https://api.tu-dominio.com/api
```

## 10) Problemas comunes y soluciones

### ⚠️ Errores de Desarrollo
- **ERROR: puerto ocupado**: Cambia el puerto en `docker/docker-compose.yml` o cierra la aplicación que usa el puerto.
- **Dependencias faltantes**: Ejecuta `npm ci` o `npm install`.
- **Errores de TypeScript**: Ejecuta `npm run lint` para ver los errores.

### 🌐 Errores de API
- **CORS errors**: Verifica que el backend tenga configurados los headers CORS correctamente.
- **Cannot connect to API**: 
  - ✅ Verifica que el backend esté corriendo en `http://localhost:8080`
  - ✅ Revisa la URL en `src/api/axios.ts`
  - ✅ Revisa la consola del navegador para más detalles
- **Datos no se cargan**: Abre las DevTools del navegador (F12) → pestaña Network → verifica el estado de la petición.

### 🐳 Errores de Docker
- **Problemas con permisos en Windows + Docker**: Asegúrate que Docker Desktop tiene acceso a las carpetas compartidas.
- **Imagen no se construye**: Limpia el caché de Docker: `docker system prune -a`.

## 📖 Recursos Adicionales

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Axios**: https://axios-http.com
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org

---



