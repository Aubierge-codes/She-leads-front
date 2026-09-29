# Eco Girls Collective: Frontend

Next.js 16 (App Router) + React 19 + Tailwind 4. Contains the **public website** (`/`, `/donate`) and the **staff dashboard** (`/login`, `/dashboard/*`).

It talks to the backend API (repository `She-leads-back`) and has no database of its own.

## Quick start

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` is baked in at build time: set it **before** `npm run build`, and rebuild if it changes.

## Everything else

The full guide covers go-live checklist, deployment, staff usage, the security model, where to edit public-site content, and troubleshooting. It lives in the backend repository: **`She-leads-back/docs/OPERATIONS_GUIDE.md`** (with a PDF copy).

## Where things are

| Path | Purpose |
|---|---|
| `app/page.tsx` | Landing page |
| `app/donate/page.tsx` | Donation pledge flow |
| `app/login/page.tsx` | Staff sign-in |
| `app/dashboard/layout.tsx` | Sidebar, sign-in guard, Logout |
| `app/dashboard/*/page.tsx` | One file per dashboard page |
| `lib/api.ts` | All API calls and types (attaches the login token) |
| `lib/auth.ts`, `lib/use-session.ts` | Session storage and hook |
| `data/girls.ts` | "Girls in Action" stories (content to fill in) |
| `public/images/` | Logos, portraits, illustrations |

## Checks

```bash
npx eslint app lib components
npm run build
```
