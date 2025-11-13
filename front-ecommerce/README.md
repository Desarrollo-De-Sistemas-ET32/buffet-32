<<<<<<< Updated upstream
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcommerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&demo-url=https%3A%2F%2Fdemo.vercel.store&demo-image=https%3A%2F%2Fbigcommerce-demo-asset-ksvtgfvnd.vercel.app%2Fbigcommerce.png&env=COMPANY_NAME,SHOPIFY_REVALIDATION_SECRET,SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SITE_NAME)

# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Providers

Vercel will only be actively maintaining a Shopify version [as outlined in our vision and strategy for Next.js Commerce](https://github.com/vercel/commerce/pull/966).

Vercel is happy to partner and work with any commerce provider to help them get a similar template up and running and listed below. Alternative providers should be able to fork this repository and swap out the `lib/shopify` file with their own implementation while leaving the rest of the template mostly unchanged.

- Shopify (this repository)
- [BigCommerce](https://github.com/bigcommerce/nextjs-commerce) ([Demo](https://next-commerce-v2.vercel.app/))
- [Ecwid by Lightspeed](https://github.com/Ecwid/ecwid-nextjs-commerce/) ([Demo](https://ecwid-nextjs-commerce.vercel.app/))
- [Geins](https://github.com/geins-io/vercel-nextjs-commerce) ([Demo](https://geins-nextjs-commerce-starter.vercel.app/))
- [Medusa](https://github.com/medusajs/vercel-commerce) ([Demo](https://medusa-nextjs-commerce.vercel.app/))
- [Prodigy Commerce](https://github.com/prodigycommerce/nextjs-commerce) ([Demo](https://prodigy-nextjs-commerce.vercel.app/))
- [Saleor](https://github.com/saleor/nextjs-commerce) ([Demo](https://saleor-commerce.vercel.app/))
- [Shopware](https://github.com/shopwareLabs/vercel-commerce) ([Demo](https://shopware-vercel-commerce-react.vercel.app/))
- [Swell](https://github.com/swellstores/verswell-commerce) ([Demo](https://verswell-commerce.vercel.app/))
- [Umbraco](https://github.com/umbraco/Umbraco.VercelCommerce.Demo) ([Demo](https://vercel-commerce-demo.umbraco.com/))
- [Wix](https://github.com/wix/headless-templates/tree/main/nextjs/commerce) ([Demo](https://wix-nextjs-commerce.vercel.app/))
- [Fourthwall](https://github.com/FourthwallHQ/vercel-commerce) ([Demo](https://vercel-storefront.fourthwall.app/))

> Note: Providers, if you are looking to use similar products for your demo, you can [download these assets](https://drive.google.com/file/d/1q_bKerjrwZgHwCw0ovfUMW6He9VtepO_/view?usp=sharing).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`
=======
# Front Ecommerce

Aplicación de comercio electrónico construida con Next.js (App Router) y MongoDB. El storefront expone catálogo, detalle de producto, autenticación, wishlist, carrito con checkout mixto (Mercado Pago o pago en efectivo) y un panel administrativo para gestionar contenido, héroe, categorías, cupones y FAQs sin necesidad de redeploy.

## Índice
1. [Panorama general](#panorama-general)
2. [Requerimientos](#requerimientos)
3. [Ejecución](#ejecución)
4. [Descripción técnica del proyecto](#descripción-técnica-del-proyecto)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Páginas y módulos clave](#páginas-y-módulos-clave)
7. [Flujos principales](#flujos-principales)
8. [Datos, seeders y configuración](#datos-seeders-y-configuración)
9. [Participación del equipo (5 integrantes)](#participación-del-equipo-5-integrantes)

## Panorama general
- Storefront responsive 100% en español con UI basada en Tailwind + shadcn/ui.
- React Query (TanStack) sincroniza el estado del cliente con server actions sin duplicar lógica.
- BFF con server actions/handlers en `app/api/` para catálogos, auth, carrito, pago y contenido dinámico.
- Integraciones: MongoDB (persistencia), R2/S3 (assets), Mercado Pago (checkout), Resend (emails transaccionales).

## Requerimientos
- Node.js >= 18
- npm (o pnpm/yarn/bun) para manejar scripts
- Acceso a MongoDB y a las credenciales externas (Mercado Pago, R2/S3, Resend) cuando se usen server actions con escritura
>>>>>>> Stashed changes

## Ejecución
```bash
<<<<<<< Updated upstream
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

1. Run `vc link`.
1. Select the `Vercel Solutions` scope.
1. Connect to the existing `commerce-shopify` project.
1. Run `vc env pull` to get environment variables.
1. Run `pnpm dev` to ensure everything is working correctly.
</details>

## Vercel, Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront on Vercel.
=======
npm install           # instala dependencias
npm run dev           # entorno de desarrollo en http://localhost:3000

npm run build         # genera build de producción
npm start             # sirve la build

npm run seed:faq      # pobla categorías/preguntas frecuentes
npm run seed:admin    # crea usuarios administrativos de prueba
```

## Descripción técnica del proyecto
### 4️⃣ Descripción técnica del proyecto
#### a) Arquitectura del sistema
**Diagrama simple**
```
[Cliente web Next.js]
        |
        v
[Capas UI + Contextos]
        |
        v
[Server Actions / API Routes]
        |
        +--> MongoDB (Mongoose)
        +--> Servicios externos (R2/S3, Mercado Pago, Resend)
```

**Capas o módulos**
- **Presentación** (`app/`, `components/`, `styles` via Tailwind): Renderiza rutas públicas/privadas, controla layout, formularios y feedback.
- **Estado de cliente** (`context/`, `hooks/`, React Query + Zustand): Maneja auth, carrito, filtros y sincronización con server actions.
- **Acceso a datos** (`actions/`, `app/api/`, `lib/`): Server actions como BFF, validan, formatean y orquestan pedidos hacia MongoDB y servicios externos.
- **Persistencia** (`models/`, `db/`): Modelos Mongoose, seeders y conexión (`lib/mongodb.ts`).
- **Utilidades compartidas** (`utils/`, `types/`, `data/`): Tipos TypeScript, helpers y seeds que reutilizan acciones.

**Flujo de datos**
1. El usuario interactúa con componentes (ej. `components/home/HomeContainer`) que consultan React Query.
2. Los hooks invocan server actions (`actions/products.ts`, `actions/cart.ts`, etc.) que corren en el edge/server.
3. Las server actions conectan a MongoDB via `lib/mongodb.ts`, normalizan datos y devuelven DTOs serializables.
4. Si la operación lo requiere, la acción coordina con servicios externos (Mercado Pago para checkout, Resend para emails, R2 para media).
5. El estado se actualiza en cliente mediante invalidaciones de React Query/Zustand, manteniendo UI y datos en sync.

#### b) MVP logrado
Producto mínimo funcional logrado:
- Catálogo navegable con filtros, búsqueda incremental y productos destacados administrables.
- Detalle de producto con variantes de stock, wishlist, alertas de reposición y CTA directo al carrito.
- Autenticación y recuperación de contraseña completa (login, registro, recover/reset vía tokens).
- Carrito persistente por usuario con cupones, cálculo de totales y checkout validando stock antes de derivar a Mercado Pago o generar pedido cash.
- Panel administrativo para gestionar héroe del home, productos, categorías, cupones, órdenes y FAQs, incluyendo carga de imágenes a R2.

#### c) Tecnologías utilizadas
| Categoría | Tecnologías | Justificación |
| --- | --- | --- |
| Lenguajes | TypeScript (full stack) + CSS utilitario vía Tailwind | Tipado estático y DX moderna en todo el stack; Tailwind permite estilos consistentes sin hojas separadas. |
| Frameworks | Next.js 15 (App Router), React 19, Node.js | App Router habilita server actions y streaming; React 19 aporta concurrent rendering; Node ejecuta serverless handlers y seeders. |
| Librerías principales | TanStack React Query, React Hook Form + Zod, shadcn/ui + Radix, Zustand, Mercado Pago SDK, Resend, AWS S3/R2 SDK | React Query sincroniza datos sin prop drilling; RHF+Zod centraliza validación; shadcn/ui ofrece UI accesible; Zustand guarda estados locales; SDKs externos conectan pagos, emails y storage. |

## Estructura del proyecto
```
front-ecommerce/
├── actions/              # Server actions para productos, categorías, auth, checkout, FAQ, etc.
├── app/                  # Rutas y páginas (App Router)
│   ├── layout.tsx        # Layout raíz con providers
│   ├── page.tsx          # Landing y home dinámico
│   ├── products/         # Catálogo general
│   ├── product/[id]/     # Detalle de producto
│   ├── contact/, faq/    # Contenido informativo
│   ├── login/, register/ # Autenticación
│   ├── profile/          # Panel de usuario autenticado
│   ├── checkout_details/ # Checkout
│   ├── success_payment/  # Post pago
│   ├── admin/            # Panel administrativo
│   └── api/              # Handlers REST complementarios
├── components/           # UI (home, products, checkout, auth, profile, admin, ui atoms)
├── context/              # Contextos globales (auth, tema, etc.)
├── hooks/                # Hooks personalizados (cart, auth, wishlist, contact, etc.)
├── lib/                  # Configs y servicios (Mongo, sesiones, S3/R2)
├── models/ + db/         # Modelos Mongoose y seeders
├── types/                # Tipados compartidos
├── utils/                # Helpers (money, visibilidad de páginas)
└── data/                 # Seeds estáticos (FAQ, configuraciones)
```

## Páginas y módulos clave
| Ruta | Descripción |
| --- | --- |
| `/` | Hero configurable, carrusel de destacados y categorías dinámicas desde server actions. |
| `/products` | Catálogo con filtros (nombre, categoría, precio, descuento, destacados) e infinite scroll usando React Query. |
| `/product/[id]` | Detalle con galería, stock, wishlist, alertas de reposición y productos relacionados. |
| `/contact` | Formulario validado con Zod + datos de soporte y CTA hacia FAQ. |
| `/faq` | Preguntas frecuentes agrupadas, buscador y acordeones. |
| `/login` / `/register` | Formularios de autenticación con "recuérdame", validaciones y aceptación de términos. |
| `/recover-password` / `/reset-password` | Flujo completo de recuperación mediante tokens. |
| `/profile` | Tabs para datos personales, pedidos, wishlist y ajustes. |
| `/checkout_details` | Checkout con resumen de carrito, cupones y formulario de envío/pago (cash o Mercado Pago). |
| `/success_payment` | Resumen posterior al pago con estado del pedido. |
| `/admin` | Entrada al panel administrativo (protected route). |
| `/not-found` | Página 404 personalizada. |

## Flujos principales
- **Autenticación**: `actions/auth.ts` + `context/auth-context.tsx` + `hooks/useAuth.ts` sincronizan session checking, roles y logout.
- **Carrito y checkout**: `hooks/useCartTanstack.ts` coordina React Query con server actions; `components/checkout/CheckoutDetail.tsx` valida stock y dispara pagos Mercado Pago o pedidos cash.
- **Catálogo y wishlist**: `actions/products.ts` normaliza imágenes y wishlists según usuario; `components/products/` renderiza cards, filtros e infinite scroll.
- **Contenido dinámico**: `actions/admin.ts` y componentes en `components/admin/` permiten configurar héroe, destacados, categorías, cupones y FAQs.
- **Notificaciones**: Emails transaccionales (`components/emails/`) enviados via Resend para reset de contraseña, contacto, checkout y alertas de stock.

## Datos, seeders y configuración
- `.env.local`: variables para `MONGODB_URI`, credenciales de Mercado Pago, claves R2/S3 (`R2_ACCESS_KEY`, etc.), `RESEND_API_KEY` y secretos de sesión.
- `npm run seed:faq`: ejecuta `db/faqseeder.ts`, crea categorías/preguntas iniciales desde `data/faq.ts` asegurando idempotencia.
- `npm run seed:admin`: pobla usuarios administrativos para acceder al panel.
- Los assets del héroe se suben vía `/api/upload-image`, guardando referencias normalizadas con `lib/r2.ts`.

## Participación del equipo (5 integrantes)
Cada integrante expone un fragmento real del código, su responsabilidad y preguntas técnicas que puede responder.

### Integrante 1 – Sofía (Experiencia pública y home dinámico)
**Responsabilidades**: Componer el home con datos administrables, manejar estados de carga/errores y condicionar secciones destacadas.

```tsx
// components/home/HomeContainer.tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['home-config'],
  queryFn: getHomeConfig,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 15,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});
...
{data?.data.featuredProducts?.isEnabled && (
  <FeaturedProducts
    title={data.data.featuredProducts.title}
    layout={data.data.featuredProducts.layout}
    maxProducts={data.data.featuredProducts.maxProducts}
    autoPlay={data.data.featuredProducts.autoPlay}
    showViewAllButton={data.data.featuredProducts.showViewAllButton}
    viewAllButtonText={data.data.featuredProducts.viewAllButtonText}
  />
)}
```
**Explicación**: Usa React Query para cachear la configuración del home y renderiza hero/carrusel según flags administrados; evita refetch innecesario con `staleTime/gcTime`.
**Preguntas que puede responder**: Cómo se desacopla contenido del deploy; configuración de React Query en páginas públicas.

### Integrante 2 – Mateo (Catálogo, filtros y normalización de datos)
**Responsabilidades**: Server actions que consultan MongoDB, normalizan imágenes desde R2 y enriquecen productos con wishlist.

```ts
// actions/products.ts
await connectToDB();
const products = await Product.find(query)
  .populate('category')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
const plainProducts = products.map(toPlainProduct);
if (userId) {
  const wishlist = await Wishlist.findOne({ user: userId });
  const wishlistedIds = wishlist ? wishlist.products.map((p) => p.toString()) : [];
  productsWithWishlist = plainProducts.map((product) => ({
    ...product,
    isWishlisted: wishlistedIds.includes(product._id.toString()),
  }));
}
```
**Explicación**: Combina paginación, filtros y normalización para que la UI reciba productos serializables con flag `isWishlisted` sin consultas extra.
**Preguntas**: Cómo se arma el BFF con server actions, manejo de ObjectId y paginación.

### Integrante 3 – Lucía (Autenticación y control de sesión)
**Responsabilidades**: Contexto de autenticación que expone estado, roles y logout reusable en cliente.

```tsx
// context/auth-context.tsx
const checkAuthentication = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await checkSession();
    setIsAuthenticated(response.isAuthenticated);
    setUserId(response.userId as string | null);
    if (response.isAuthenticated && response.userId) {
      setUser({
        id: response.userId as string,
        username: '',
        email: '',
        role: (response.userRole as 'admin' | 'user') || 'user',
      });
    } else {
      setUser(null);
    }
  } finally {
    setIsLoading(false);
  }
}, []);
```
**Explicación**: Centraliza la verificación de sesión a través de `checkSession`, expone `isAdmin`/`hasRole` y sincroniza logout con server actions.
**Preguntas**: Diferencia entre context y server actions para auth, cómo se manejan roles y estados de carga.

### Integrante 4 – Diego (Carrito, checkout y validación de stock)
**Responsabilidades**: Hooks y componentes que ligan React Query con validaciones de stock y disparo de pagos.

```ts
// hooks/useCartTanstack.ts
const { data, isLoading, error } = useQuery({
  queryKey: ['cart', userId],
  queryFn: () => getCart(userId as string),
  enabled: !!userId,
});
const { mutate: addToCartMutation } = useMutation({
  mutationFn: (productId: string) => addToCart({ userId: userId as string, productId, quantity }),
  onSuccess: (result) => {
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast.success('Product added to cart');
    }
  },
});
```
**Explicación**: Mantiene el carrito sincronizado por usuario, invalida cache tras mutaciones y expone helpers (`isUpdatingItem`, `isRemovingItem`).
**Preguntas**: Estrategias de invalidación en React Query, manejo de errores optimista en carrito.

### Integrante 5 – Valentina (Panel admin y CMS para el home)
**Responsabilidades**: Formularios del panel admin con validaciones Zod, subida de imágenes y manejo de estado local/remoto.

```tsx
// components/admin/HomeConfigForm.tsx
const homeConfigSchema = z.object({
  _id: z.string(),
  heroTitle: z.string().min(1, 'El título del héroe es obligatorio'),
  heroDescription: z.string().min(1, 'La descripción del héroe es obligatoria'),
  heroImage: z.url('La imagen del héroe debe ser una URL válida'),
  heroPrimaryButtonText: z.string().min(1),
  heroPrimaryButtonLink: z.string().min(1),
  heroSecondaryButtonText: z.string().min(1),
  heroSecondaryButtonLink: z.string().min(1),
});
...
const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file.type.startsWith('image/')) {
    toast.error('Por favor, selecciona un archivo de imagen válido');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('El tamaño de la imagen debe ser inferior a 5MB');
    return;
  }
  const url = URL.createObjectURL(file);
  setSelectedFile(file);
  setPreviewUrl(url);
  setValue('heroImage', url, { shouldValidate: true });
};
```
**Explicación**: Define el contrato del formulario con Zod, valida inputs en tiempo real y gestiona carga/preview de imágenes antes de subirlas a R2.
**Preguntas**: Cómo integrar RHF + Zod + upload S3/R2, manejo de archivos y feedback al admin.

Cada integrante puede detallar su feature en la presentación, mostrar el fragmento anterior, justificar decisiones y responder sobre dependencias técnicas específicas.
>>>>>>> Stashed changes
