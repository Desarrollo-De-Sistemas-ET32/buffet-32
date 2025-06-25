# Buffet-32: Next.js + Supabase + Drizzle + Zustand + Clerk

Este proyecto utiliza Next.js como framework base, integrado con Supabase para la base de datos, Drizzle como ORM, Zustand para el manejo de estado, y Clerk para autenticación y gestión de usuarios.

## Tecnologías Principales

- **Next.js**: Framework de React para producción
- **Supabase**: Base de datos PostgreSQL serverless
- **Drizzle ORM**: ORM TypeScript-first para bases de datos
- **Zustand**: Librería de manejo de estado
- **Clerk**: Sistema de autenticación y gestión de usuarios

## Configuración del Proyecto

### Requisitos Previos

```bash
node >= 18.0.0
npm >= 8.0.0
```

### Instalación

```bash
npm install
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgres://postgres.[TU-REFERENCIA-PROYECTO]:[TU-PASSWORD]@aws-0-[TU-REGION].pooler.supabase.com:6543/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Autenticación con Clerk

### Configuración de Clerk

El proyecto utiliza Clerk para la autenticación y gestión de usuarios. La configuración se encuentra en:

- `src/middleware.ts`: Configuración de rutas protegidas y públicas
- `src/app/layout.tsx`: Configuración del ClerkProvider
- `src/components/auth/`: Componentes de autenticación

### Rutas Protegidas

El middleware de Clerk protege automáticamente todas las rutas excepto:

```typescript
const publicRoutes = [
  "/",
  "/api/public",
  "/sign-in",
  "/sign-up"
];
```

### Componentes de Autenticación

```typescript
// Botón de inicio de sesión
import { SignInButton } from "@clerk/nextjs";

// Botón de usuario y menú
import { UserButton } from "@clerk/nextjs";

// Componentes condicionales
import { SignedIn, SignedOut } from "@clerk/nextjs";
```

### Uso en Páginas Protegidas

```typescript
// En páginas del servidor (Server Components)
import { auth } from "@clerk/nextjs/server";

export default async function ProtectedPage() {
  const { userId } = auth();
  // ...
}

// En componentes del cliente (Client Components)
"use client";
import { useUser } from "@clerk/nextjs";

export default function ClientComponent() {
  const { user } = useUser();
  // ...
}
```

## Estructura de Directorios

```
src/
├── app/                 # Páginas y rutas de Next.js
│   ├── dashboard/      # Página protegida de ejemplo
│   └── layout.tsx      # Layout con ClerkProvider
├── components/         # Componentes React
│   ├── auth/          # Componentes de autenticación
│   │   ├── SignInButton.tsx
│   │   └── UserButton.tsx
│   ├── Navigation.tsx
│   └── UserList.tsx
├── db/                 # Configuración de Drizzle y esquemas
├── stores/            # Stores de Zustand
└── middleware.ts      # Middleware de Clerk
```

## Manejo de Estado con Zustand

### Estructura de Stores

Los stores se encuentran en `src/stores/` y utilizan Zustand:

```typescript
// Ejemplo de uso de un store
import useUserStore from '../stores/useUserStore';

function Component() {
  const { users, addUser } = useUserStore();
  // ...
}
```

### Ejemplo de Store

```typescript
// Definición de tipos
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Store con Zustand
const useUserStore = create<UserState>((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  // ...
}));
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Producción
npm run start

# Linting
npm run lint

# Scripts de Base de Datos
npm run db:push
npm run db:studio
npm run db:seed
npm run db:reset
npm run db:prod
```

## Mejores Prácticas

- Usa la directiva "use client" en componentes que usen hooks de Clerk o Zustand
- Protege las rutas sensibles usando el middleware de Clerk
- Utiliza los componentes de autenticación de Clerk para una experiencia consistente
- Mantén los stores pequeños y específicos
- Utiliza TypeScript para mejor tipo-seguridad

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Drizzle](https://orm.drizzle.team)
- [Documentación de Zustand](https://github.com/pmndrs/zustand)
- [Documentación de Clerk](https://clerk.com/docs)

## Contribuir

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Seguir las convenciones de código existentes
2. Agregar pruebas para nuevas funcionalidades
3. Actualizar la documentación según sea necesario

## Licencia

MIT
