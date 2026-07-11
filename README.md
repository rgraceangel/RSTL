# App

A production-ready Next.js application scaffold.

## Stack

- **Next.js 15** — App Router
- **React 19** + **TypeScript**
- **Tailwind CSS** — utility-first styling with CSS variable design tokens
- **Supabase** — auth & database (browser client, server client, session-refresh middleware)
- **Framer Motion** — animation (mobile nav transitions)
- **React Hook Form** + **Zod** — form state and schema validation
- **Lucide Icons** — icon set

## Folder structure

```
src/
  app/                    Route segments (App Router). Root layout + global styles only for now.
    layout.tsx            Root layout: fonts, metadata, SupabaseProvider, MainLayout
    globals.css           Tailwind directives + CSS variable design tokens
    page.tsx               Placeholder home route

  components/
    layout/                Structural, page-independent layout pieces
      MainLayout.tsx        Navbar + main + Footer wrapper
      Navbar.tsx             Sticky responsive nav bar
      MobileMenu.tsx         Animated (Framer Motion) mobile nav panel
      Footer.tsx              Site footer
      Container.tsx           Max-width content wrapper
    ui/                     Reusable, presentation-only primitives
      Button.tsx              Variant/size-driven button
      Logo.tsx                Site logo/name, links home
    providers/              React context providers
      SupabaseProvider.tsx   Supplies a Supabase browser client via context

  hooks/                   Reusable client-side hooks
    useSupabase.ts          Access the Supabase client from context
    useMediaQuery.ts        Responsive breakpoint hook
    useMounted.ts           Hydration-safe mounted flag
    index.ts                Barrel export

  lib/
    supabase/
      client.ts             Browser Supabase client (createBrowserClient)
      server.ts              Server Supabase client for Server Components/Actions
      middleware.ts           Session refresh helper used by src/middleware.ts
    validations/
      common.ts               Shared Zod schemas (email, password, name)
      index.ts                 Barrel export
    utils.ts                 `cn()` classname helper (clsx + tailwind-merge)

  types/
    index.ts                 Shared app types (NavItem, SiteConfig) + re-exports
    supabase.ts               Placeholder for `supabase gen types typescript` output

  constants/
    site.ts                   Site config: name, description, nav items
    index.ts                  Barrel export

  middleware.ts              Root middleware: refreshes Supabase session on each request

public/                     Static assets
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your Supabase project values:

   ```bash
   cp .env.local.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Type-check and lint:

   ```bash
   npm run type-check
   npm run lint
   ```

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never expose to the client) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL of the app |

## Conventions

- Path alias `@/*` maps to `src/*`.
- Server-only Supabase access goes through `lib/supabase/server.ts`; client-side access goes through `lib/supabase/client.ts` via `useSupabase()`.
- Form validation schemas live in `lib/validations` and are meant to be paired with `react-hook-form` + `@hookform/resolvers/zod`.
- `components/ui` holds generic, page-agnostic primitives; `components/layout` holds structural chrome (nav, footer, containers).

## Status

Architecture and shared scaffolding only — no feature pages have been built yet. `src/app/page.tsx` is a temporary placeholder.
