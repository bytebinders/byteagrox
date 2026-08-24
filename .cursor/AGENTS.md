# ByteAgroX Agent Instructions

Agricultural trade marketplace and escrow settlement platform (pnpm monorepo, Turborepo). Milestone 1 (monorepo foundation) is complete; most API features are planned in `docs/issues/`.

## Repository Structure

```text
byteagrox/
├── apps/
│   ├── api/                    # NestJS REST API (:3001)
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       └── health/         # Only implemented module today
│   └── web/                    # Next.js 14 App Router (:3000)
│       └── app/
├── packages/
│   ├── auth/                   # Session types, role checks
│   ├── config/                 # Shared tsconfig.base.json
│   ├── database/               # Drizzle ORM, PostgreSQL schema, db client
│   ├── stellar/                # Stellar SDK (backend-only)
│   ├── types/                  # Domain enums, interfaces, state machine
│   ├── validation/             # Shared Zod schemas
│   └── ui/                     # Brand design tokens
├── docs/                       # architecture, security, domain-model, issues/
├── scripts/
├── .github/workflows/ci.yml
└── turbo.json
```

## Package Boundaries

| Package | May import | Must NOT import |
|---------|-----------|-----------------|
| `apps/web` | `@byteagrox/types`, `@byteagrox/validation`, `@byteagrox/ui` | `@byteagrox/database`, `@byteagrox/stellar` |
| `apps/api` | All `@byteagrox/*` domain packages | — |
| `packages/stellar` | `@byteagrox/types`, `@byteagrox/validation` | `apps/*` |
| `packages/database` | Drizzle, postgres | `apps/*`, `@byteagrox/stellar` |

## Where Code Lives

| Concern | Location |
|---------|----------|
| Domain types & state machine | `packages/types/src/index.ts` |
| Zod schemas | `packages/validation/src/index.ts` |
| DB schema | `packages/database/src/schema/index.ts` |
| DB client | `packages/database/src/client.ts` |
| Stellar logic | `packages/stellar/src/` |
| NestJS features | `apps/api/src/<feature>/` |
| Next.js pages | `apps/web/app/` |

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start web + api via Turborepo
pnpm build            # Build all packages
pnpm typecheck        # TypeScript check
pnpm format           # Prettier
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
```

## Implementation Status

- **Implemented**: `GET /health`, monorepo packages, Drizzle schema, Stellar service stubs
- **Planned**: Auth, listings, orders, Stellar integration — see `docs/issues/` and `docs/roadmap.md`

## Rules & Skills

- **Rules** (`.cursor/rules/`): `project-conventions`, `security`, `typescript`
- **Skills** (`.cursor/skills/`): `architecture`, `database`, `request-validation`

Read the relevant skill before working in that domain. Follow all always-applied rules for every change.

## Change Guidelines

1. Minimize scope — match existing patterns in the file you edit.
2. Never use boolean flags for payment/settlement state; use `OrderStatus` enum only.
3. Validate all API inputs with `@byteagrox/validation` Zod schemas.
4. Call `isValidOrderTransition()` before any order status update.
5. Log financial status changes to `audit_logs` inside `db.transaction()`.
6. Keep secrets in environment variables; never expose to web clients or commit to git.
7. After schema changes: edit `packages/database/src/schema/index.ts`, then `pnpm db:generate`.

## Reference Docs

- `docs/architecture.md` — system topology
- `docs/security.md` — threat model
- `docs/domain-model.md` — entities and relationships
- `docs/stellar.md` — blockchain integration
