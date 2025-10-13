# Next.js Commerce con Integración de Mercado Pago

Este es un proyecto de e-commerce de alto rendimiento construido con Next.js (App Router), adaptado para utilizar **Mercado Pago** como pasarela de pagos principal.

## 1. Configuración del Entorno

La configuración del proyecto se gestiona a través de variables de entorno. Es **obligatorio** crear un archivo `.env.local` en la raíz del proyecto.

### 1.1. Crear el archivo `.env.local`

Copia el contenido de `.env.example` y pégalo en un nuevo archivo llamado `.env.local`.

### 1.2. Variables de Entorno

Asegúrate de configurar las siguientes variables en tu archivo `.env.local`:

-   `DATABASE_URL`: La cadena de conexión a tu base de datos PostgreSQL.
    -   *Nota de desarrollo*: Si usas un proveedor como Supabase o Vercel Postgres, es posible que encuentres un error de SSL. La solución aplicada en este proyecto está en `lib/drizzle/db.ts`, donde se usa `ssl: { rejectUnauthorized: false }` para el entorno de desarrollo.

-   `MP_ACCESS_TOKEN`: Tu **Access Token privado** de Mercado Pago. Se usa en el backend para generar las preferencias de pago. Lo obtienes de tu [Panel de Desarrollador](https://www.mercadopago.com/developers/panel).

-   `NEXT_PUBLIC_MP_PUBLIC_KEY`: Tu **Public Key** de Mercado Pago. Se usa en el frontend para inicializar el SDK y renderizar el botón de pago.

**¡Importante!** Cada vez que modifiques el archivo `.env.local`, debes **reiniciar tu servidor de desarrollo** para que los cambios se apliquen.

## 2. Ejecutar la Aplicación Localmente

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:3000`.

## 3. Arquitectura de la Integración con Mercado Pago

El flujo de pago se divide en tres componentes principales:

1.  **Página de Checkout (`/app/checkout/page.tsx`):**
    -   Es un Server Component que obtiene los productos del carrito.
    -   Renderiza el componente del botón de pago, pasándole el carrito como propiedad.

2.  **Componente del Botón (`/components/mercadopago/mercadopago-button.tsx`):**
    -   Es un Client Component que recibe el carrito.
    -   Al hacer clic, realiza una petición `POST` al endpoint del backend (`/api/mercadopago`) para crear la preferencia de pago.
    -   Una vez que recibe el `preferenceId`, renderiza el componente `<Wallet/>` de Mercado Pago para que el usuario complete el pago.

3.  **Endpoint del Backend (`/api/mercadopago/route.ts`):**
    -   Recibe el carrito desde el frontend.
    -   Se comunica con la API de Mercado Pago usando el `MP_ACCESS_TOKEN`.
    -   Crea una preferencia de pago con los items, precios y las URLs de retorno (`back_urls`).
    -   Devuelve el `preferenceId` al frontend.

## 4. Guía de Depuración (Errores Comunes Solucionados)

Durante la integración, se solucionaron varios problemas comunes:

### Error 1: `invalid_token`

-   **Causa:** El backend no está leyendo el `MP_ACCESS_TOKEN` correctamente. Generalmente, esto sucede porque el archivo `.env.local` no está bien configurado o el servidor no se ha reiniciado tras un cambio.
-   **Solución:** Verificar que el token en `.env.local` sea correcto y **reiniciar el servidor de desarrollo**.

### Error 2: `SELF_SIGNED_CERT_IN_CHAIN`

-   **Causa:** Error de conexión SSL con la base de datos (ej. Supabase) en el entorno de desarrollo local. Node.js no confía en el certificado del servidor de la BD.
-   **Solución:** Se modificó `lib/drizzle/db.ts` para añadir la opción `ssl: { rejectUnauthorized: false }` a la configuración del Pool de `node-postgres`. **Nota:** Esto es solo para desarrollo.

### Error 3: `invalid_auto_return`

-   **Causa:** Mercado Pago requiere que las `back_urls` (URL de éxito, fallo, etc.) sean públicas (HTTPS) y no puede acceder a `localhost`.
-   **Solución de Desarrollo:** Usar un servicio de túnel como `ngrok`.
    1.  Instalar `ngrok` (`brew install ngrok/ngrok/ngrok`).
    2.  Ejecutar `ngrok http 3000` para obtener una URL pública (ej: `https://<id-aleatorio>.ngrok-free.app`).
    3.  Reemplazar la URL base en las `back_urls` dentro de `app/api/mercadopago/route.ts` con la URL de `ngrok`.

## 5. Probar la API Directamente

Para verificar que el backend y tus credenciales funcionan correctamente de forma aislada, puedes usar `curl`:

```bash
curl -X POST http://localhost:3000/api/mercadopago \
-H "Content-Type: application/json" \
-d 
'{ 
  "cart": { 
    "lines": [ 
      { 
        "quantity": 1, 
        "merchandise": { 
          "id": "item-mock-123", 
          "product": { 
            "title": "Producto de Prueba" 
          } 
        }, 
        "cost": { 
          "totalAmount": { 
            "amount": "123.45", 
            "currencyCode": "ARS" 
          } 
        } 
      } 
    ] 
  } 
}'
```

Una respuesta exitosa se verá así: `{"preferenceId":"..."}`.