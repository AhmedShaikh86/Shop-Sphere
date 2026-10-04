# ShopSphere

**Style, curated for you.**

ShopSphere is a premium multi-vendor fashion marketplace: customers discover and buy clothing,
shoes, bags and accessories; sellers run their own storefronts, products, inventory and orders;
admins moderate the whole marketplace. It's a full-stack demo built with a Laravel API backend and
a Next.js frontend.

> This is a portfolio/demo project. Payments run through a local demo gateway unless you configure
> real Stripe keys (see [Payment setup](#payment-setup)), and all seed data is fictional.

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Demo Accounts](#demo-accounts)
- [Payment Setup](#payment-setup)
- [Image Setup](#image-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)

## Overview

ShopSphere has three user roles — **Customer**, **Seller**, and **Admin** — each with their own
part of the app. The storefront is a public, editorial-style Next.js site; sellers and admins get
dedicated dashboards for managing their part of the marketplace. All business rules (inventory,
pricing, authorization, order status transitions) live in the Laravel API — the frontend never
trusts client-side state for anything that matters (price, stock, payment status).

## Screenshots

_Add screenshots of the homepage, product page, cart, checkout, seller dashboard and admin
dashboard here once you have the app running locally._

```
docs/screenshots/homepage.png
docs/screenshots/product-page.png
docs/screenshots/checkout.png
docs/screenshots/seller-dashboard.png
docs/screenshots/admin-dashboard.png
```

## Features

### Customer
- Registration, login, logout, forgot/reset password, change password, profile
- Homepage: hero, new arrivals, shop by category, featured collection, editorial section, best
  sellers, brand story, customer reviews, newsletter signup
- Shop with filters (category, brand, price range, size, color, rating, on sale, in stock) and
  sorting, plus dedicated category/brand/collection pages
- Global search overlay (recent searches, live results) and a full search page
- Product page: gallery with zoom, size/color variant selection, size guide, quantity, add to
  cart, buy now, wishlist, description/materials/shipping tabs, related products, "frequently
  bought together", recently viewed, reviews with a review form
- Wishlist, cart drawer + full cart page, checkout (address, coupon, demo payment, order summary),
  order confirmation
- Order history, order detail, order cancellation, return request, printable invoice
- Addresses, notifications, account settings

### Seller
- Dashboard with revenue, orders, units sold, average order value, a 30-day sales trend chart,
  top products and low-stock alerts (scoped to that seller's store only)
- Product management: create/edit with multiple variants (size, color, SKU, price, stock) and a
  drag-to-reorder image gallery backed by real file uploads; draft → pending review → published →
  archived workflow
- Order management with status updates, customer list, review list, coupon management, store
  profile/branding

### Admin
- Marketplace-wide dashboard: sales, orders, customers, sellers, products, pending approvals,
  low-stock count, revenue/order charts, top categories and products, recent orders/users
- Seller approval/suspension, product approval/rejection, category/brand/collection management,
  order management, platform-wide coupons, review moderation, activity log

### Platform-wide
- Role-based authorization enforced on the backend (never just hidden UI)
- Inventory reservation/commit/release so stock can't be oversold, backed by DB transactions and
  row locking (including on the coupon's own usage-limit counter, to close the same race)
- A payment gateway abstraction with a demo provider (default) and real Stripe support (opt-in)
- Consistent `{ success, data }` / `{ success, message, errors }` JSON envelope and centralized
  exception handling — every foreseeable failure (bad coupon, out of stock, declined card, invalid
  order transition, missing record, or a plain permission/state check like "this isn't your
  address") renders as a clean JSON error with the right status code, never a raw stack trace,
  handled in one place (`bootstrap/app.php`) rather than repeated per controller
- A suspended seller's store is actually suspended: their products disappear from the public site
  immediately, and they're blocked from creating or resubmitting products — not just a label change
  on their dashboard
- Rate limiting: 120 req/min per user (or IP, when logged out) on the API generally, 10 req/min per
  IP on login/register/password-reset specifically
- Per-page SEO metadata (title, description, Open Graph) on every public storefront page, generated
  server-side from live data — not just a static fallback title everywhere
- Loading/empty/error states throughout; accessible dialogs (focus trap, Escape to close, focus
  returned to the trigger on close) shared by every modal/drawer/overlay via one `useDialogBehavior`
  hook; keyboard-navigable search

## Architecture

```
Route → Controller → Form Request (validation) → Policy/role middleware (authorization)
      → Service/Action (business logic) → Model (database) → API Resource (response)
```

```
Page → Feature component → Hook (TanStack Query) → Service (axios) → Laravel API
```

Backend request flow keeps controllers thin: validation lives in Form Requests, authorization in
Policies/middleware, and business logic (checkout, inventory, coupons, order transitions) in
`app/Services`. The frontend never computes prices, stock, or order totals for anything that gets
submitted — it re-derives them from what the API returns.

Most pages are client components (the app leans on TanStack Query for data fetching, loading/error
states, and cache invalidation after mutations). The handful of pages where a real page title and
search/social preview matter — product, category, brand, collection, shop — are a thin async
Server Component (`page.js`, exporting `generateMetadata`) wrapping a client component
(`XPageClient.js`) that does the actual interactive fetching; see `src/lib/server-fetch.js`.
Everything behind auth (account/seller/admin) sets its tab title via a small `usePageTitle` hook
instead, since metadata exports aren't available once a layout needs to be a client component for
its auth guard.

## Tech Stack

**Frontend:** Next.js (App Router) · React · JavaScript · Tailwind CSS v4 · TanStack Query ·
Axios · React Hook Form · Zod · Zustand · Lucide React · Recharts · dnd-kit

**Backend:** PHP · Laravel 13 · Laravel Sanctum (token auth) · API Resources · Form Requests ·
Policies · Service classes · Events/Listeners · Notifications (mail + database) · Queues

**Database:** SQLite for local development (zero setup); MySQL/PostgreSQL supported for
production via standard Laravel `DB_*` env vars.

## Folder Structure

```
/
  backend/                 Laravel API
    app/
      Console/Commands/     images:sync-placements
      Enums/                Domain enums (UserRole, OrderStatus, ProductStatus, ...)
      Exceptions/            Custom exceptions rendered as clean JSON errors
      Http/
        Controllers/Api/V1/  Controllers (Auth, catalog, cart, checkout, Seller/, Admin/, Webhooks/)
        Middleware/           EnsureUserHasRole
        Requests/             Form Requests (validation)
        Resources/            API Resources (response shaping)
        Responses/            ApiResponse (success/error envelope helper)
      Models/                Eloquent models
      Notifications/         Mail + database notifications
      Policies/              Authorization policies
      Services/              Business logic (Checkout, Inventory, Coupon, Cart, Order, Analytics,
                              Payments, Unsplash)
    database/
      migrations/
      factories/
      seeders/
    routes/api.php           Versioned /api/v1 routes
    tests/Feature/            Feature tests

  frontend/                 Next.js app
    src/
      app/                   App Router pages
        (site)/               Public storefront + customer account (shared header/footer)
        (auth)/               Login/register/password pages (minimal layout)
        seller/                Seller dashboard
        admin/                 Admin dashboard
      components/            ui/, layout/, product/, home/, account/, seller/, admin/, coupons/, dashboard/
      hooks/                 TanStack Query hooks per domain, plus useDialogBehavior and usePageTitle
      services/               Axios API calls per domain
      store/                  Zustand stores (auth, UI, toasts)
      lib/                    Axios client (client-side) and server-fetch.js (Server Component fetches)
      utils/                 Formatters, class-name helper, nav-matching helper

  README.md
  .gitignore
```

## Prerequisites

- **Node.js** 20+ and npm
- **PHP** 8.2+ with the `openssl`, `mbstring`, `pdo_sqlite` (or `pdo_mysql`), `fileinfo`, `curl`,
  `gd` and `zip` extensions
- **Composer**
- A database: **SQLite** (no setup needed) or **MySQL/PostgreSQL**

## Environment Variables

Copy the example files and adjust as needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**backend/.env** (key variables — see `.env.example` for the full list):

| Variable | Purpose |
|---|---|
| `APP_URL` | Base URL of the API (default `http://localhost:8000`) |
| `FRONTEND_URL` | Used for CORS and links inside emails (default `http://localhost:3000`) |
| `DB_CONNECTION`, `DB_DATABASE`, ... | Database connection (defaults to SQLite) |
| `STRIPE_KEY` / `STRIPE_SECRET` / `STRIPE_WEBHOOK_SECRET` | Optional — enables real Stripe payments |
| `CLOUDINARY_URL` | Optional — not required; local disk storage is used by default |
| `UNSPLASH_ACCESS_KEY` | Optional — reserved for future real Unsplash image search |
| `MAIL_MAILER` | Defaults to `log` so emails are written to `storage/logs/laravel.log` instead of actually sending |

**frontend/.env.local**:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API, including `/api/v1` (e.g. `http://localhost:8000/api/v1`) |
| `NEXT_PUBLIC_APP_NAME` | Shown in a few UI strings |

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# SQLite (default) — creates the database file and runs migrations:
touch database/database.sqlite
php artisan migrate

# Seed a full demo store (categories, brands, collections, 5 sellers, 40+ products,
# customers, orders, coupons, reviews, activity logs):
php artisan db:seed

# Serve uploaded product/store images (product image uploads write here):
php artisan storage:link

php artisan serve
# API is now running at http://localhost:8000/api/v1
```

Notifications (welcome email, order confirmation, shipping updates, seller/product approval,
low stock, return requests) are queued (`QUEUE_CONNECTION=database` by default), so run a worker
alongside `php artisan serve` for them to actually send/appear:

```bash
php artisan queue:work
```

Without a running worker, queued jobs just sit in the `jobs` table — nothing errors, but
in-app notifications and emails never show up. For a quicker local setup with no extra process,
set `QUEUE_CONNECTION=sync` in `.env` instead, which runs notifications immediately inline.

To use MySQL/PostgreSQL instead, set `DB_CONNECTION`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`,
`DB_PASSWORD` in `.env` before running `php artisan migrate --seed`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # adjust NEXT_PUBLIC_API_URL if your API isn't on :8000
npm run dev
# App is now running at http://localhost:3000
```

Make sure the backend is running first — the frontend has no mock/offline mode; every page reads
live data from the API.

## Demo Accounts

All seeded accounts use the password **`password`**.

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@shopsphere.test` | Full marketplace access |
| Seller | `seller.atelier@shopsphere.test` | Store: Atelier North |
| Seller | `seller.meridian@shopsphere.test` | Store: Meridian |
| Seller | `seller.forma@shopsphere.test` | Store: Forma |
| Seller | `seller.elan@shopsphere.test` | Store: Élan Studio |
| Seller | `seller.northline@shopsphere.test` | Store: Northline |
| Customer | `olivia.bennett@example.com` | One of 10 seeded customers with order history |

(Any of the other seeded customers — see `database/seeders/CustomerSeeder.php` — also work.)

Seeded coupon codes: `WELCOME10` (10% off, $50 min), `SHIP20` ($20 off, $150 min), `ATELIER15`
(15% off Atelier North items only, $100 min).

## Payment Setup

Checkout is backed by a small `PaymentGateway` interface with two implementations:

- **`DemoPaymentGateway`** (default, used automatically when `STRIPE_SECRET` is empty) — clearly
  a local stand-in, never a real charge. Any card number succeeds **except** one ending in `0002`,
  which simulates a decline so you can test the failure path. The checkout page pre-fills a
  successful test card and explains this in the UI.
- **`StripePaymentGateway`** — real Stripe PaymentIntents, used automatically once you set
  `STRIPE_KEY`, `STRIPE_SECRET` (and `STRIPE_WEBHOOK_SECRET` if you wire up
  `POST /api/v1/webhooks/stripe` in the Stripe dashboard). The webhook is the source of truth for
  payment status — the frontend's "success" response is never trusted on its own.

No frontend code changes are needed to switch providers; it's controlled entirely by the backend
`.env`.

## Image Setup

**Product/store images** are uploaded through `POST /api/v1/uploads/image` and stored on the
local public disk (`storage/app/public`, served via `php artisan storage:link`). This works out
of the box with no third-party credentials.

**Editorial imagery** — the homepage hero, brand-story section, category banners, and collection
banners — is seeded with [Picsum](https://picsum.photos) placeholder photography by default (no
key needed, deterministic per placement, never 404s). To resolve these same eleven placements to
real, properly-licensed Unsplash photography instead:

```bash
cd backend
# UNSPLASH_ACCESS_KEY must be set in .env first — see .env.example
php artisan images:sync-placements
```

This is a one-off sync, not a live API call on every page view — Unsplash's free tier is
rate-limited to 50 requests/hour, and these placements rarely change, so the resolved photo URL
and its required attribution (photographer name + Unsplash, both linked) are cached in the
database (`categories`/`collections`.`photo_credit_*` columns, and a `site_images` table for the
hero/brand-story slots) and served from there. The access key itself never reaches the frontend —
only the resolved URL and credit text do, via `CategoryResource`/`CollectionResource` and
`GET /api/v1/site-images`.

If a photo ever fails to load (or no key is configured and no seed fallback exists for a given
slot), the frontend shows a local branded gradient placeholder (`EditorialImage` /
`.gradient-fallback` in `globals.css`) rather than a broken image icon — the app never depends on
a live image request succeeding.

Editing a category/collection's image manually from the admin dashboard clears any cached
Unsplash attribution on that record, since it's no longer accurate.

## Testing

**Backend** (PHPUnit, runs against an in-memory SQLite database):

```bash
cd backend
composer test
# or: php artisan test
```

Covers authentication, role-based authorization, product CRUD and the seller approval workflow,
cart operations and stock validation, the full checkout flow (order creation, inventory
commit/rollback, declined payments, coupon validation rules), order status transitions (including
that an invalid transition is rejected cleanly, not a 500), seller data isolation (products,
coupons — and that an admin can't reach into a seller's own coupon through the platform-wide
admin endpoint), suspended-store enforcement (hidden from the public catalog, blocked from
publishing), category/brand/collection lookup by slug, admin permissions, centralized exception
handling (plain `abort()` calls render the API's normal JSON envelope, not a stack trace), and the
Unsplash placement sync (via `Http::fake()`, so it never calls the real API).

**Backend code style:**

```bash
cd backend
./vendor/bin/pint          # auto-fix
./vendor/bin/pint --test   # check only
```

**Frontend lint:**

```bash
cd frontend
npm run lint
```

**Frontend production build** (also catches issues dev mode won't):

```bash
cd frontend
npm run build
```

## Deployment

- **Backend**: any standard Laravel host (e.g. a VPS with PHP-FPM + Nginx, or a platform like
  Laravel Forge/Vapor). Set `APP_ENV=production`, `APP_DEBUG=false`, a real `DB_*` connection,
  `FRONTEND_URL` to your deployed frontend's origin, and run `php artisan migrate --force`.
  Queue workers (`php artisan queue:work`) should run continuously so notification emails send.
- **Frontend**: any Next.js host (e.g. Vercel). Set `NEXT_PUBLIC_API_URL` to your deployed API's
  `/api/v1` URL.
- Update `backend/config/cors.php` (`FRONTEND_URL`) so the deployed frontend origin is allowed.

## Troubleshooting

- **"Slow filesystem detected" / dev server slow to respond on first request** — this is Next.js
  warning about the filesystem under `frontend/.next`, commonly caused by antivirus/Windows
  Defender real-time scanning. Excluding the project folder from real-time scanning speeds this up
  significantly; otherwise just wait — first compile can take 30–60s longer than usual.
- **CORS errors in the browser console** — check `FRONTEND_URL` in `backend/.env` matches the
  origin the frontend is actually running on.
- **401 on every request** — the frontend stores its Sanctum token in `localStorage`
  (`shopsphere-auth`); clearing it and logging in again resolves a stale/expired token.
- **"Class not found" after pulling changes** — run `composer dump-autoload` in `backend/`.
- **Images not loading** — confirm `php artisan storage:link` has been run (creates
  `backend/public/storage`), and that `next.config.mjs`'s `images.remotePatterns` includes your
  image host if you change away from the seeded Picsum URLs.
- **SQLite "database is locked"** — stop any other process (like a second `php artisan serve`)
  writing to `database/database.sqlite` at the same time.
- **Welcome email / order confirmation / notification bell never shows anything** — start
  `php artisan queue:work` (see [Backend Setup](#backend-setup)), or set `QUEUE_CONNECTION=sync`
  in `.env` for local testing.

## Known Limitations

These are intentional scope decisions for a demo of this size, not oversights:

- **Order status is per-order, not per-item.** In a real multi-vendor marketplace, each seller
  would ideally fulfill and track their own line items independently. Here, any seller with items
  in an order can advance its single shared status. Documented in the seller order detail UI by
  scoping the visible line items to that seller's own products.
- **Newsletter and contact forms** are presentational — there's no `NewsletterSubscriber` or
  `ContactMessage` model/endpoint in the spec's data model, so these submit client-side with a
  friendly confirmation rather than persisting anywhere.
- **"Frequently bought together"** is a simple category-based heuristic (a different slice of
  related products), not a real purchase-pattern recommendation engine.
- **No dark mode.** The design commits to one considered light palette rather than maintaining two.
- **Return requests** log an activity entry and notify admins but don't drive a full
  refund/RMA workflow — intentionally lightweight "architecture" per the spec, not a complete
  returns management system.
- **Unsplash integration** resolves eleven fixed editorial placements (hero, category banners,
  collection banners, brand story) via a one-off sync command, not an open-ended admin image
  search/picker — product photography still goes through the local upload endpoint. See
  [Image Setup](#image-setup).
