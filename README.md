# ByteAgroX

> Agricultural trade built on trust.

ByteAgroX is a trusted digital agricultural marketplace and escrow settlement platform developed by **Bytebinders Tech Solution Company**, designed initially for agricultural commerce in **Hadejia, Jigawa State, Nigeria**, backed by Stellar ecosystem infrastructure.

---

## 1. What is ByteAgroX?

ByteAgroX is an end-to-end digital marketplace and settlement engine for agricultural trade. It connects grain and commodity farmers in Hadejia with bulk commercial buyers, protecting both sides through an explicit financial state machine and trusted escrow settlement.

---

## 2. The Hadejia Problem

In Hadejia and surrounding agricultural trade hubs in Jigawa State:
- **Trust Deficit**: Farmers and buyers often have to trust each other with large sums of money or produce without reliable guarantees.
- **Payment Risk**: Farmers risk non-payment or delayed settlement after dispatching produce.
- **Quality Risk**: Buyers risk receiving sub-standard produce after advancing cash payments.
- **Lack of Verification**: Traditional transactions lack auditable digital history, preventing farmers from building creditworthiness or reputation.

---

## 3. Product Vision

ByteAgroX transforms agricultural commerce into a seamless, trusted experience:
- Farmers list verified produce (e.g. Paddy Rice, Wheat, Sesame) with transparent pricing in Nigerian Naira (₦).
- Buyers lock funds into secure escrow before produce is dispatched.
- Produce is delivered and inspected in Hadejia.
- Settlement payouts are automatically triggered upon buyer confirmation, backed by Stellar blockchain settlement infrastructure.

---

## 4. How AgroEscrow Will Work

```text
Buyer
  │
  ├─► Selects 50 bags of Hadejia Rice (₦1,200,000)
  │
  ├─► Funds locked in AgroEscrow (PAYMENT_SECURED)
  │
Farmer
  │
  ├─► Prepares & dispatches produce (DELIVERY_IN_PROGRESS)
  │
Buyer
  │
  ├─► Inspects & confirms delivery (DELIVERY_CONFIRMED)
  │
Escrow System
  │
  └─► Releases payout to Farmer (SETTLED via Stellar)
```

Users interact with familiar local currency (₦) without managing crypto wallets or complex keys.

---

## 5. Technology Stack

- **Monorepo**: pnpm Workspaces + Turborepo
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, REST API
- **Database**: PostgreSQL, Drizzle ORM
- **Blockchain Infrastructure**: Stellar SDK (configured for Testnet development)
- **Validation**: Zod

---

## 6. Monorepo Architecture

```text
ByteAgroX/
├── apps/
│   ├── web/              # Next.js frontend application
│   └── api/              # NestJS REST API service
│
├── packages/
│   ├── database/         # PostgreSQL schema (Drizzle ORM) & 14 core entities
│   ├── stellar/          # Stellar SDK Testnet abstractions & services
│   ├── types/            # Shared domain types & Financial State Machine
│   ├── validation/       # Zod schemas for input validation
│   ├── config/           # Shared ESLint & TypeScript configs
│   ├── auth/             # Authentication boundary helpers
│   └── ui/               # Shared brand design tokens
│
├── docs/                 # Architecture, domain model, security, stellar, roadmap
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

---

## 7. Local Development

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Setup Commands
```bash
# Install dependencies across all packages
pnpm install

# Run all applications in development mode
pnpm dev

# Build all workspace applications & packages
pnpm build

# Lint all workspace packages
pnpm lint

# Check TypeScript types across workspace
pnpm check-types
```

---

## 8. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Environment Variable Guide

| Variable | Description | Safe to Commit? |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`development` / `production`) | ✅ Yes |
| `PORT` | API server port (`3001`) | ✅ Yes |
| `WEB_PORT` | Web app port (`3000`) | ✅ Yes |
| `STELLAR_NETWORK` | Stellar network (`TESTNET`) | ✅ Yes |
| `STELLAR_HORIZON_URL` | Horizon server URL | ✅ Yes |
| `STELLAR_ESCROW_PUBLIC_KEY` | Escrow public address | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection string | ❌ NO (Contains credentials) |
| `STELLAR_ESCROW_SECRET_KEY` | Stellar account secret key | ❌ NO (NEVER COMMIT SECRETS) |
| `JWT_SECRET` | Authentication token secret key | ❌ NO |

---

## 9. Database Setup

1. Configure your PostgreSQL database URL in `.env`.
2. Generate Drizzle migrations:
   ```bash
   pnpm db:generate
   ```
3. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

---

## 10. Stellar Testnet Setup

1. `@byteagrox/stellar` connects automatically to Stellar Testnet Horizon (`https://horizon-testnet.stellar.org`).
2. Testnet accounts can be funded using `WalletService.fundTestnetAccount(publicKey)` via Stellar Friendbot (`https://friendbot.stellar.org`).

---

## 11. Testing

```bash
# Run unit and integration tests across the workspace
pnpm test
```

---

## 12. Deployment Considerations

- **Frontend (`apps/web`)**: Deployable to Vercel, Netlify, or Docker container.
- **Backend API (`apps/api`)**: Deployable to Node.js container environments (AWS ECS, Render, Railway).
- **Database**: Managed PostgreSQL (Neon, Supabase, AWS RDS).
- **Secrets Management**: Inject secret environment variables directly into server environment secret managers (AWS Secrets Manager, HashiCorp Vault).

---

## 13. Security Considerations

- **Explicit State Machine**: Transitions require valid state progression (`isValidOrderTransition`).
- **Audit Logs**: Append-only log of all financial status changes.
- **Non-Custodial Secrets**: User keys and secret keys are never exposed to web clients.
- **Input Hygiene**: All inputs sanitized via Zod schemas.

---

## 14. Roadmap

See [`docs/roadmap.md`](file:///c:/Users/hp/Desktop/projects/ByteAgroX/docs/roadmap.md) for detailed milestone breakdown.
- **Milestone 1**: Monorepo Foundation (Completed)
- **Milestone 2**: User Onboarding & Auth
- **Milestone 3**: Marketplace & Listings
- **Milestone 4**: Escrow Engine & Stellar Settlement
- **Milestone 5**: Delivery & Dispute Resolution
- **Milestone 6**: Reputation & Local Expansion
