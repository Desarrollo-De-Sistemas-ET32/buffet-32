# Frontend Ecommerce

This project is a Next.js App Router storefront that consumes the public Fake Store API hosted at `https://fake-store-api-2no73ornoa-uc.a.run.app`. Products, category listings, and search results are rendered from that REST API, while cart interactions are handled locally in memory until the real backend is ready.

## Features

- Next.js 15 App Router with React Server Components
- Server Actions for cart mutations
- Fake Store API integration with a local fallback dataset
- Clerk authentication wrapper (disabled by default without keys)
- Tailwind-based UI components bundled with the template

## Environment Variables

Copy `.env.example` to `.env.local` and adjust as needed:

```bash
cp .env.example .env.local
```

Available variables:

- `COMPANY_NAME` – Brand name shown in metadata.
- `SITE_NAME` – Default site title.
- `FAKE_STORE_API_BASE_URL` – Base URL for the product API (defaults to the hosted Fake Store endpoint).
- `DATABASE_URL` – Optional Postgres connection for Drizzle (not required for local mocks).
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` – Only needed if Clerk auth is enabled.

## Getting Started

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

If the remote Fake Store API is unreachable, the storefront automatically falls back to a bundled catalogue so the UI remains populated.

## Image Domains

Remote product images are served from `i.ibb.co`. If you change image sources in the API or fallback dataset, update `next.config.ts` with the additional domains.

## Folder Structure Highlights

- `app/` – App Router routes and layouts.
- `components/` – UI components, including cart and layout primitives.
- `lib/store/` – Fake Store API client, local cart helpers, and TypeScript models.
- `lib/constants.ts` – Sorting options and revalidation tags.

## Notes

- Cart data is stored in an in-memory map and keyed by a cookie during the session. Replace these helpers when the real backend is ready.
- The fallback dataset lives inside `lib/store/index.ts` so the site remains browseable offline; extend or replace it as needed.
