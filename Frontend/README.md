# Frontend - Aplicación Web Saber Pro

Interfaz web desarrollada con **React 19 + Vite** que consume la API del backend para predecir el rendimiento académico de estudiantes en las pruebas Saber Pro.

---

## Tabla de contenido

- [Requisitos previos](#requisitos-previos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Despliegue local (desarrollo)](#despliegue-local-desarrollo)
  - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [2. Instalar dependencias](#2-instalar-dependencias)
  - [3. Configurar la URL del backend](#3-configurar-la-url-del-backend)
  - [4. Ejecutar el servidor de desarrollo](#4-ejecutar-el-servidor-de-desarrollo)
- [Build de producción](#build-de-producción)
- [Despliegue en red local (LAN)](#despliegue-en-red-local-lan)
- [Despliegue en producción](#despliegue-en-producción)
- [Solución de problemas](#solución-de-problemas)

---

## Requisitos previos

- **Node.js 18 o superior** (recomendado 20+).
- **npm 9+** (incluido con Node.js). Opcionalmente puedes usar `pnpm` o `yarn`.
- El **Backend** debe estar corriendo (ver `Backend/README.md`).

Verifica las versiones instaladas:

```bash
node --version
npm --version
```

---

## Estructura del proyecto

```
Frontend/
├── public/                     # Archivos estáticos
├── src/
│   ├── assets/                 # Imágenes y recursos
│   ├── components/             # Componentes reutilizables
│   ├── data/
│   │   └── formOptions.js      # Constantes y URL de la API
│   ├── pages/                  # Páginas de la aplicación
│   ├── utils/                  # Utilidades JS
│   ├── App.jsx                 # Componente raíz
│   ├── FormularioSaberPro.jsx  # Formulario individual
│   ├── index.css               # Estilos globales
│   └── main.jsx                # Punto de entrada de React
├── index.html                  # HTML base de Vite
├── package.json                # Scripts y dependencias
├── vite.config.js              # Configuración de Vite
└── eslint.config.js            # Configuración de ESLint
```

---

## Despliegue local (desarrollo)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd TesisApp/Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instala las dependencias declaradas en `package.json`:

- `react`, `react-dom` (^19.2.0)
- `vite` (^7.2.4) y `@vitejs/plugin-react`
- ESLint y plugins asociados

### 3. Configurar la URL del backend

Por defecto el frontend apunta a `http://127.0.0.1:5000`. Si tu backend está en otra máquina o puerto, edita:

**`src/data/formOptions.js`**

```js
export const API_URL = 'http://127.0.0.1:5000';
```

> Si el backend está en otra máquina de la misma red, usa la IP local que muestra el backend al iniciar (ej. `http://192.168.1.20:5000`).

> Revisa también `src/FormularioSaberPro.jsx` por si quedó alguna URL hardcodeada.

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Salida esperada:

```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173).

---

## Build de producción

Para generar los archivos estáticos optimizados:

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

Para previsualizar el build localmente:

```bash
npm run preview
```

---

## Despliegue en red local (LAN)

Para que otros equipos de la misma red accedan al frontend:

1. Inicia el servidor de desarrollo exponiendo la red:

   ```bash
   npm run dev -- --host
   ```

   Vite mostrará la URL de red, por ejemplo `http://192.168.1.30:5173`.

2. Asegúrate de que el **firewall de Windows** permita el puerto `5173`:

   ```powershell
   New-NetFirewallRule -DisplayName "Vite 5173" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
   ```

3. Verifica que `API_URL` en `src/data/formOptions.js` apunte a la **IP de red** del backend (no `127.0.0.1`), de lo contrario los demás equipos no podrán predecir.

---

## Despliegue en producción

### Opción A: Servidor estático (Nginx, IIS, Apache)

1. Genera el build:

   ```bash
   npm run build
   ```

2. Copia el contenido de `dist/` al directorio público del servidor web.

**Ejemplo de configuración Nginx:**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/saberpro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Opción B: Servicios cloud (recomendado)

#### Vercel

```bash
npm install -g vercel
vercel
```

Configura la variable de entorno de la URL del backend en el panel de Vercel.

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Build command: `npm run build` · Publish directory: `dist`.

#### GitHub Pages

Instala `gh-pages` y agrega en `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

Y configura la `base` en `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/nombre-del-repo/',
})
```

### Opción C: Docker

Crea un `Dockerfile` en `Frontend/`:

```dockerfile
# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de servido
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Construye y ejecuta:

```bash
docker build -t saberpro-frontend .
docker run -p 8080:80 saberpro-frontend
```

---

## Variables de entorno (opcional, recomendado)

Para evitar editar el código al cambiar de entorno, puedes externalizar la URL del backend usando variables de Vite:

1. Crea un archivo `.env` en la raíz de `Frontend/`:

   ```
   VITE_API_URL=http://127.0.0.1:5000
   ```

2. Reemplaza en `src/data/formOptions.js`:

   ```js
   export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
   ```

3. Reinicia `npm run dev`. Para producción usa `.env.production`.

---

## Solución de problemas

| Error | Causa probable | Solución |
|---|---|---|
| `Failed to fetch` / `Network Error` | El backend no está corriendo o `API_URL` es incorrecta | Inicia el backend y revisa `src/data/formOptions.js` |
| `CORS policy: No 'Access-Control-Allow-Origin'` | CORS mal configurado en el backend | Verifica que el backend tenga `flask-cors` activo (ya viene configurado) |
| Pantalla en blanco tras `npm run build` | Ruta `base` incorrecta en Vite | Ajusta `base` en `vite.config.js` según el host de despliegue |
| `npm install` falla con errores de permisos | Falta de privilegios en la carpeta `node_modules` | Borra `node_modules` y `package-lock.json` y reinstala |
| `EADDRINUSE: address already in use :::5173` | Puerto 5173 ocupado | Cambia el puerto: `npm run dev -- --port 5174` |
| Otros equipos en LAN no conectan al frontend | Firewall o falta de `--host` | Ejecuta `npm run dev -- --host` y abre el puerto en el firewall |

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el código fuente |

---

## Licencia

Proyecto académico - Trabajo de tesis.
