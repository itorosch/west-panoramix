# West Panoramix — Sistema de Gestión de Eventos

Aplicación desarrollada con **Next.js (SSR)** y **Node.js + Express** para el registro y visualización de eventos de la productora internacional West Panoramix.

---

## Estructura del proyecto

```
west-panoramix/
├── backend-eventos/     # API REST con Node.js + Express
└── frontend-eventos/    # Aplicación cliente con React + Next.js
```

---

## Requisitos previos

- **Node.js** v18 o superior  
- **npm** v9 o superior

---

## Instrucciones para ejecutar

### 1. Backend

```bash
cd backend-eventos
npm install
npm run dev
```

El servidor quedará corriendo en: **http://localhost:3001**

### 2. Frontend (en otra terminal)

```bash
cd frontend-eventos
npm install
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

---

## Funcionalidades

- **SSR con Next.js**: Los eventos se cargan desde el servidor con un delay simulado de 3 segundos.
- **Skeleton loaders**: Retroalimentación visual durante la carga de datos.
- **Lazy loading con `next/dynamic`**: EventoForm, EventoList y AlertMessage se cargan de forma diferida.
- **Formulario de eventos** con validación de campos:
  - Identificador automático y correlativo
  - Nombre del evento
  - Dirección
  - País (selector)
  - Ciudad (selector, dependiente del país)
  - Nombre Productora
  - Fecha y hora de inicio
  - Fecha y hora de término
  - Fecha y hora de registro (automática)
  - Estado: Pendiente / Iniciado / Finalizado (radio buttons)
- **Listado de eventos** con filtro por estado y opción de eliminar.
- **Persistencia** a través de API REST (datos guardados en `backend-eventos/data/eventos.json`).

---

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/eventos | Listar todos los eventos |
| POST | /api/eventos | Crear nuevo evento |
| DELETE | /api/eventos/:id | Eliminar evento por ID |
