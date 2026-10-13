# Zenova MM

![CI](https://github.com/usmanten/ZenovaSite/actions/workflows/ci.yml/badge.svg)

Production e-commerce site for **Zenova MM**, a dietary-supplement brand that sells energy supplements delivered as oral dissolvable strips. Built end-to-end as client/contract work: storefront, checkout, payments, shipping fulfillment, and post-purchase customer engagement.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/animation:** Tailwind CSS v4, GSAP, Framer Motion
- **Payments:** Stripe (Checkout Sessions, webhooks)
- **Shipping:** Shippo (label purchasing, rate shopping)
- **Database:** Supabase (Postgres)
- **Email:** Resend (transactional + admin notifications)
- **Testing:** Vitest

## Features

- **Product catalog + checkout** — quantity/bundle selection, Stripe Checkout Sessions with dynamically created shipping rates, US-only address collection, and one-time discount codes.
- **Automated fulfillment** — on successful payment, the Stripe webhook purchases the cheapest available Shippo shipping label, emails the customer a tracking link, and records the order in Supabase.
- **Live inventory counter** — a homepage "strips remaining" counter backed by real order data.
- **Anonymized customer leaderboard** — ranks real customers by strips purchased, with names masked server-side (raw name/email never reaches the client) and a signed, self-service opt-out link sent in the order confirmation email.
- **Transactional + admin email** — order confirmations, shipping notifications, and admin alerts for failures (label purchase failures, DB write failures) via Resend.

## Architecture

Key files, for orientation:

- `app/api/checkout/route.ts` — Stripe Checkout session creation, inventory/discount validation
- `app/api/webhook/route.ts` — Stripe webhook handler: verifies the event, purchases a shipping label, writes the order, sends emails
- `lib/shippo.ts` / `lib/shippo-helpers.ts` — Shippo integration and its pure rate-selection/quantity-clamping logic
- `lib/strips-inventory.ts` / `lib/strips-inventory-math.ts` — Supabase-backed inventory lookup and its pure claimed/remaining math
- `lib/anonymize-name.ts` — server-side name masking for the public leaderboard
- `lib/leaderboard-optout.ts` — HMAC-signed opt-out links for the leaderboard
- `components/catalog-page.tsx` — product catalog with quantity selector + checkout
- `components/leaderboard-modal.tsx` / `components/strip-counter.tsx` — live, polling UI for the leaderboard and inventory counter

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real Stripe/Supabase/Shippo/Resend values
npm run dev
```

To test the Stripe webhook locally, use the Stripe CLI to forward events and use the secret it prints (not the dashboard's):

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Testing

```bash
npm test
```

The test suite covers the project's pure business logic — leaderboard name anonymization, opt-out token signing/verification, and the inventory/shipping-rate math — none of which touch a network or database, so they run fast and deterministically. It intentionally does not attempt to cover the API routes themselves (checkout, webhook, leaderboard): those are thin orchestration over four external services (Stripe, Supabase, Shippo, Resend) where a meaningful test would mostly be testing the mocks. CI runs lint, the test suite, and a production build on every push/PR.

## Rights

This repository is shared publicly for portfolio and demonstration purposes only. The code, content, and Zenova MM brand belong to Zenova MM; no license is granted to copy, reuse, or redistribute it.
