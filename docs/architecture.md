# ByteAgroX Architecture Documentation

## 1. System Topology Overview

ByteAgroX is structured as a modern pnpm monorepo using Turborepo for build orchestration. The architecture decouples user experience from backend financial transaction processing and blockchain settlement infrastructure.

```text
                    ByteAgroX Platform
                            │
              ┌─────────────┴─────────────┐
              │                           │
           Web App                     API Service
       (apps/web: Next.js)       (apps/api: NestJS REST)
              │                           │
              └─────────────┬─────────────┘
                            │
                      Domain Layer
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
  Database Package    Stellar Package      Auth Package
(packages/database) (packages/stellar)   (packages/auth)
  PostgreSQL/Drizzle  Stellar Testnet
```

## 2. Component Responsibilities

### `apps/web` (Next.js 14 App Router)
- **Role**: Client interface for Farmers, Buyers, Field Agents, and System Administrators.
- **Key Responsibilities**: UI render, form state, API query execution, responsive desktop/mobile workflows.
- **Constraints**: No direct access to database credentials or Stellar secret keys.

### `apps/api` (NestJS REST Server)
- **Role**: Core application service layer, authentication boundary, and domain event handler.
- **Key Responsibilities**:
  - Input validation via Zod schemas (`@byteagrox/validation`).
  - Executing Order Financial State Machine transitions.
  - Dispatching escrow transactions via `@byteagrox/stellar`.
  - Maintaining immutable audit logs via `@byteagrox/database`.
  - Exposing REST API endpoints (e.g., `GET /health`, `/orders`, `/listings`).

### `packages/database`
- **Role**: Data access layer backed by PostgreSQL & Drizzle ORM.
- **Entities**: Users, Farmer profiles, Buyer profiles, Categories, Products, Listings, Orders, Escrows, Payments, Deliveries, Disputes, Reputation, Notifications, Audit Logs.
- **Security**: Relational integrity, transactional locks during state changes, timestamp auditing.

### `packages/stellar`
- **Role**: Stellar Blockchain abstraction layer for Testnet development.
- **Key Responsibilities**:
  - `StellarClient`: Connection management to Stellar Horizon endpoints.
  - `WalletService`: Keypair generation and Testnet Friendbot funding.
  - `PaymentService`: Transaction building for NGN settlement claims.
  - `EscrowService`: Multi-sig / time-locked account escrow abstractions.
  - `TransactionService`: Monitoring Horizon submission states.
- **Isolation**: All Stellar SDK logic remains isolated in this package.

### `packages/types`
- Shared TypeScript interfaces, financial state machine enums, and request/response contracts.

### `packages/validation`
- Shared Zod validation schemas enforcing strict input criteria across API and Web layers.

### `packages/config`
- Shared TypeScript (`tsconfig.base.json`) and linter settings.

### `packages/auth` & `packages/ui`
- Auth role verification helpers and shared design tokens.
