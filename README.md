# West Panoramix — EFT Semana 9

Sistema de gestión de eventos para la productora internacional West Panoramix.  
Desarrollado con **Next.js 15 (SSR)**, **React Hook Form**, **next-intl (i18n)** y **Node.js + Express**.

---

## Estructura del proyecto

```
west-panoramix/
├── backend-eventos/     # API REST — Node.js + Express
└── frontend-eventos/    # Cliente — React + Next.js 15
```

---

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

---

## Cómo ejecutar

### 1. Backend (Terminal 1)

```bash
cd backend-eventos
npm install
npm run dev
```

Servidor en: **http://localhost:3001**

### 2. Frontend (Terminal 2)

```bash
cd frontend-eventos
npm install
npm run dev
```

Aplicación en: **http://localhost:3000**

---

## Usuarios de prueba

| Usuario     | Contraseña  | Rol          | Productora           |
|-------------|-------------|--------------|----------------------|
| admin       | admin123    | Administrador | —                   |
| gamboa      | gamboa123   | Productora   | Gamboa Producciones  |
| panoramix   | pan123      | Productora   | Panoramix Events     |

---

## Funcionalidades implementadas

### Autenticación con roles (simulada)
- Login con usuario, contraseña y rol
- **Admin**: acceso completo (crear, editar, eliminar, ver todos los eventos)
- **Productora**: solo visualiza sus propios eventos

### SSR con Next.js
- `force-dynamic` en la página principal
- Carga de eventos desde el servidor con delay simulado de 3 segundos
- Skeleton loaders durante la espera

### Internacionalización (i18n)
- Soporte en **español** e **inglés**
- Cambio manual desde la navbar
- Configurado con **next-intl**, persistido en cookie

### Formularios con React Hook Form
- Registro y edición de eventos
- Validaciones en tiempo real
- Mensajes de error localizados (ES/EN)
- ID y fecha de registro en modo solo lectura al editar

### CRUD completo de eventos
- **Crear** evento con ID autoincremental
- **Leer** listado con filtro por estado
- **Editar** todos los campos editables
- **Eliminar** evento del listado

### Lazy loading con next/dynamic
- `EventoForm`, `EventoList` y `AlertMessage` cargados de forma diferida

### Persistencia
- API REST (Express) con almacenamiento en `data/eventos.json`

### Diseño responsivo
- Adaptado para móvil, tablet y escritorio
- Navegación por teclado y atributos `aria-label`

---

## Endpoints del backend

| Método | Ruta              | Descripción          |
|--------|-------------------|----------------------|
| GET    | /api/eventos      | Listar todos          |
| POST   | /api/eventos      | Crear evento          |
| PUT    | /api/eventos/:id  | Editar evento         |
| DELETE | /api/eventos/:id  | Eliminar evento       |
