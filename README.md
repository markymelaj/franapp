# FranAPP

Recetario móvil de snacks y meriendas saludables creado para Francisca. Incluye 30 recetas fáciles, búsqueda, filtros, favoritos, planificación semanal, lista de compras y lectura sin conexión.

## Funciones principales

- 30 recetas ilustradas.
- Selección por momento: colegio, antes de danza, después de danza o en casa.
- Buscador por receta e ingredientes.
- Favoritos y planificación semanal.
- Lista de compras automática.
- Instalación como app web en iPhone.
- Recetario disponible sin conexión.

## Ejecutar el proyecto

Requisitos:

- Node.js 22.13 o superior.
- pnpm 11.

```bash
corepack enable
pnpm install
pnpm dev
```

Luego abrí la dirección local indicada en la terminal.

## Crear el repositorio en GitHub

1. Creá un repositorio vacío en GitHub.
2. Descomprimí este archivo.
3. Subí todos los archivos y carpetas contenidos en la carpeta del proyecto.
4. Confirmá la carga con el botón **Commit changes**.

No es necesario subir las carpetas `node_modules`, `dist` o archivos `.env`; ya están excluidos mediante `.gitignore`.

## Estructura

- `app/`: interfaz y comportamiento.
- `lib/`: recetas y lógica de planificación.
- `public/`: ilustraciones, identidad de Francisca y recursos para iPhone.
- `db/` y `drizzle/`: persistencia de favoritos y planificación.

## Tecnologías

React, TypeScript, Vinext, Tailwind CSS, Cloudflare Workers, D1 y PWA.
