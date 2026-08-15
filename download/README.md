# Sefakor Brothers Foods (SBF Foods) — PWA E-Commerce Platform

> **Authentic Ghanaian Taste, Delivered Fresh.**
> A modern, responsive, installable Progressive Web App for a Ghanaian food processing company based in Dzodze, Volta Region.

## Overview

SBF Foods is a comprehensive e-commerce + CRM + delivery + BI platform built for Sefakor Brothers Foods. It functions as:

1. **Corporate Website** — Home, About, Products, Contact
2. **Online Store** — Product catalogue, cart, coupons, secure checkout
3. **Progressive Web App** — Installable on Android, offline support, push-ready
4. **Customer Portal** — Account, order tracking, history, addresses, loyalty
5. **Admin Dashboard** — Sales analytics, products, orders, inventory, reports
6. **Distributor Portal** — Registration, bulk orders, invoices, branch management
7. **Delivery Management** — GPS capture, status pipeline, driver assignment
8. **Support Channels** — Live AI chat, WhatsApp, Messenger, phone, email

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York) + custom brand tokens
- **State**: Zustand (persisted cart + auth) + TanStack Query
- **Database**: Prisma ORM + SQLite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings) + Geist Sans (body)
- **PWA**: Web App Manifest + Service Worker + offline fallback page

## Brand Palette

| Token | Hex | Usage |
|------|-----|-------|
| `--gold` | `#D4AF37` | Primary accent, CTAs, highlights |
| `--brown` | `#5D4037` | Primary brand, text |
| `--brown-dark` | `#3E2723` | Headings, dark surfaces |
| `--cream` | `#FFF8E1` | Backgrounds, cards |
| `--brand-red` | `#C62828` | Sale badges, alerts |
| `--brand-green` | `#2E7D32` | Success, in-stock |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sbffoods.gh` | `demo-admin-2026` |
| Customer | any email | any password (demo) |
| Distributor | submit application form | — |

## Try Coupons

- `WELCOME10` — 10% off (min GHS 50)
- `DZODZE50` — GHS 15 off (min GHS 100)

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, PWA meta, SW registration
│   ├── page.tsx                # Main SPA entry — orchestrates views
│   ├── globals.css             # Brand colors, gradients, utilities
│   └── api/
│       ├── products/route.ts   # GET list + single product (by ?slug=)
│       ├── orders/route.ts     # GET (by ref), POST (create), PATCH (status)
│       ├── coupons/route.ts    # GET validate & calculate discount
│       ├── reviews/route.ts    # GET + POST reviews
│       ├── distributors/route.ts # POST application
│       └── admin/stats/route.ts # BI dashboard aggregate
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header, mobile sheet, nav
│   │   ├── Footer.tsx          # Newsletter, links, contact
│   │   ├── CartDrawer.tsx      # Slide-out cart with coupons
│   │   └── PWAInstallPrompt.tsx # Install banner (12s delay)
│   ├── sections/
│   │   ├── HomeSection.tsx     # Hero, products, why-us, testimonials, etc.
│   │   ├── AboutSection.tsx    # History, mission, vision, safety, team
│   │   ├── ProductsSection.tsx # Catalogue with filters
│   │   ├── ProductDetailSection.tsx # Gallery, sizes, tabs, reviews
│   │   ├── CartSection.tsx     # Full cart page
│   │   ├── CheckoutSection.tsx # 3-step checkout with GPS capture
│   │   ├── AccountSection.tsx  # Customer portal + order tracking
│   │   ├── AdminSection.tsx    # 7-tab admin dashboard with charts
│   │   ├── DistributorSection.tsx # Application + distributor portal
│   │   └── ContactSection.tsx  # Contact form + channels
│   ├── widgets/
│   │   └── SupportWidget.tsx   # Floating AI chat + WhatsApp
│   └── product/
│       └── ProductCard.tsx     # Product card with quick-add
├── lib/
│   ├── store.ts                # Zustand store (cart, auth, view, UI)
│   ├── db.ts                   # Prisma client
│   └── utils.ts                # cn() helper
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts

public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker (offline shell)
├── offline.html                # Offline fallback page
├── icons/                      # 192, 512, apple-touch, favicon
├── products/                   # Product SVG images (shitor, tom brown)
├── hero.svg, factory.svg, ghana-map.svg
└── logo.svg

prisma/
└── schema.prisma               # 9 models: Product, Customer, Order, etc.

scripts/
├── seed.ts                     # Products, coupons, reviews, admin
├── gen-icons.js                # PNG icons from SVG via sharp
├── gen-product-images.js       # Shitor jar + Tom Brown packet SVGs
└── gen-lifestyle-images.js     # Hero, factory, Ghana map SVGs
```

## PWA Features

- **Installable**: `beforeinstallprompt` event captured, banner shown after 12s
- **Offline shell**: Service worker caches `/`, manifest, icons, offline page
- **Network-first navigation**: Falls back to cache on failure
- **Cache-first assets**: Static icons and `_next/static` cached aggressively
- **Standalone display**: `display: standalone`, theme color `#5D4037`
- **Shortcuts**: Shop, Track Order, Become a Distributor
- **Apple touch icon**: 180×180 with rounded corners

## E-Commerce Flow

1. **Browse** Home → Products → Product Detail
2. **Add to cart** (quick-add or detail page) → Cart drawer slides in
3. **Apply coupon** (`WELCOME10` or `DZODZE50`)
4. **Checkout**:
   - Step 1: Customer info (name, phone, WhatsApp, email)
   - Step 2: Delivery address + **GPS capture** (HTML5 Geolocation API)
   - Step 3: Payment method (8 options: MTN/Telecel/AirtelTigo MoMo, Hubtel, Paystack, ExpressPay, Visa, Mastercard)
5. **Submit**: Animated processing stages → order saved to DB → confirmation page with order reference
6. **Track**: Account portal → enter order ref → 6-stage tracker (Received → Paid → Processing → Dispatched → In Transit → Delivered)

## Admin Dashboard

7 tabs with real data from the database:

- **Dashboard**: KPIs (daily/weekly/monthly sales, customers, orders), 7-day area chart, status pie, top products bar, regional demand, recent orders, low-stock alerts
- **Orders**: Filterable table with status badges
- **Products**: Grid with stock indicators
- **Inventory**: Progress bars + reorder triggers
- **Customers**: Growth line chart
- **Reports**: 6 report types with PDF/Excel export buttons
- **Delivery**: Active deliveries with live tracking buttons

## Loyalty System

- **Tiers**: Bronze → Silver → Gold → Platinum
- **Reward points** earned per order
- **Referral bonuses**, birthday discounts, seasonal promos

## Customer Support

- **AI Live Chat**: Floating button (bottom-right), 9 pre-trained responses, quick suggestions, online indicator
- **WhatsApp**: Direct link to `wa.me/233240000000`
- **Messenger**: Direct link to `m.me/sbffoods`
- **Phone**: `+233 24 000 0000`
- **Email**: `hello@sbffoods.gh`
- **Contact form**: On Contact page

## Setup

```bash
# Install dependencies
bun install

# Push database schema
bun run db:push

# Seed products, coupons, reviews, admin
bun run scripts/seed.ts

# Start dev server (auto-started in sandbox)
bun run dev

# Lint
bun run lint
```

## License

© 2026 Sefakor Brothers Foods. All rights reserved. Made with love in Dzodze, Volta Region, Ghana.
