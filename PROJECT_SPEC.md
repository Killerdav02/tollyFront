# Especificaciones del Proyecto TollyFront

## Descripción
Sistema web para gestión y alquiler de herramientas profesionales, con interfaces para administrador, proveedor y cliente. Incluye registro, login, gestión de usuarios, pagos, reportes y reservas.

## Tecnologías Utilizadas

- **Frontend:**
  - React (con TypeScript)
  - Vite (build y desarrollo)
  - Tailwind CSS (estilos)
  - PostCSS (procesamiento de CSS)
  - Axios (peticiones HTTP)
  - react-router-dom (ruteo)
  - Lucide React (iconos)

- **Gestión de Estado y Contexto:**
  - React Context API (AuthProvider, useAuth)

- **Backend (referencia):**
  - API REST (Node.js/Spring/otro, no incluido en este repo)
  - JWT para autenticación

## Estructura Principal

- `src/app/pages/` — Páginas principales (Login, Register, Dashboards)
- `src/app/components/ui/` — Componentes reutilizables (inputs, botones, alertas, etc.)
- `src/services/` — Servicios para autenticación y comunicación con backend
- `src/auth/` — Contexto y hooks de autenticación
- `src/styles/` — Archivos de estilos (Tailwind, theme, fuentes)
- `src/api/` — Configuración de apiClient (axios)

## Especificaciones Funcionales

- Registro de usuarios (cliente, proveedor, admin)
- Login y autenticación JWT
- Redirección por rol
- Gestión de reservas, pagos, reportes y usuarios
- Interfaz responsiva y moderna

## Requisitos

- Node.js >= 16
- npm >= 8

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Notas
- El backend debe estar corriendo en `http://localhost:8080` (ajustable en apiClient).
- Los endpoints principales son `/auth/login`, `/auth/register`, `/auth/me`.
- Los roles deben ser enviados en mayúsculas ("ADMIN", "SUPPLIER", "CLIENT").

---
