# ByteAgroX Engineering Roadmap

## Milestone 1: Monorepo Foundation (COMPLETED ✅)
- Clean monorepo foundation using pnpm workspaces + Turborepo.
- `apps/web`: Baseline Next.js application.
- `apps/api`: Baseline NestJS REST service with `GET /health`.
- `packages/database`: PostgreSQL schema via Drizzle ORM covering 14 core entities & audit logs.
- `packages/stellar`: `@stellar/stellar-sdk` Testnet abstractions.
- `packages/types`: Domain types & explicit Order Financial State Machine.
- `packages/validation`: Zod validation schemas.
- `docs/`: Comprehensive architecture, domain model, security, and Stellar guides.

---

## Milestone 2: User Onboarding & Auth (NEXT PLANNED STEP)
- Authentication module (JWT/OTP integration suited for Hadejia farmers & buyers).
- Farmer profile creation & verification flow.
- Buyer profile creation & verification flow.

---

## Milestone 3: Marketplace & Commodity Listings
- Farmer product listing creation (Grain bags, price per unit in NGN, Hadejia location).
- Marketplace catalog browsing and filtering for buyers.
- Order creation & placement flow (`ORDER_CREATED`).

---

## Milestone 4: Escrow Engine & Stellar Settlement
- NGN Escrow lock implementation (`PAYMENT_PENDING` -> `PAYMENT_SECURED`).
- Stellar Testnet automated settlement pipeline (`SETTLEMENT_PENDING` -> `SETTLED`).
- Idempotency & audit trail verification.

---

## Milestone 5: Logistics & Dispute Resolution
- Delivery tracking from pickup to buyer arrival (`DELIVERY_IN_PROGRESS` -> `DELIVERY_CONFIRMED`).
- Buyer inspection & delivery verification code system.
- Dispute management system & arbitration workflows (`DISPUTED` -> `RESOLVED`).

---

## Milestone 6: Reputation & Local Expansion
- Farmer & Buyer trust score engine based on completed transactions.
- Offline SMS/USSD notification integration for low-connectivity agricultural areas around Jigawa State.
