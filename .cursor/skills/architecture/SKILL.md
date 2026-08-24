---
name: architecture
description: Guides ByteAgroX monorepo architecture, package boundaries, NestJS module structure, and layer responsibilities. Use when adding features, new packages, API modules, web pages, or questions about system topology, dependency rules, or where code belongs.
---

# ByteAgroX Architecture

## System Topology

```text
Web App (apps/web)          API Service (apps/api)
Next.js 14 App Router       NestJS REST (:3001)
        │                           │
        └───────────┬───────────────┘
                    │
              Domain Layer (packages/)
    database · stellar · auth · types · validation · ui
                    │
              PostgreSQL + Stellar Testnet
```

## Layer Responsibilities

| Layer | Path | Role |
|-------|------|------|
| Web | `apps/web` | UI, forms, API calls. No DB or Stellar secrets. |
| API | `apps/api` | HTTP boundary, validation, state machine, audit logs, Stellar dispatch |
| Database | `packages/database` | Drizzle schema, `db` client, migrations |
| Stellar | `packages/stellar` | All `@stellar/stellar-sdk` usage isolated here |
| Types | `packages/types` | Enums, interfaces, `isValidOrderTransition` |
| Validation | `packages/validation` | Shared Zod schemas |
| Auth | `packages/auth` | Session types, `isAuthorizedRole` |
| UI | `packages/ui` | Brand tokens (`BYTEAGROX_BRAND`) |

## Dependency Rules

1. **Web never imports** `@byteagrox/database` or `@byteagrox/stellar`
2. **Stellar never imports** from `apps/*`
3. **Cross-package imports** use `@byteagrox/*` workspace names
4. **API orchestrates** — controllers stay thin; business logic in services + domain packages

## Adding a NestJS Feature

1. Create `apps/api/src/<feature>/` with module, controller, service
2. Import schemas from `@byteagrox/validation`, types from `@byteagrox/types`
3. Use `db` from `@byteagrox/database` for persistence
4. Register module in `app.module.ts`
5. Follow spec in `docs/issues/issue-XX-*.md` if one exists

## Adding a Web Page

1. Add route under `apps/web/app/`
2. Use `@byteagrox/ui` tokens and Tailwind
3. Call API endpoints — never access DB or Stellar directly
4. Reuse validation schemas for client-side form validation when applicable

## Financial Flow (Orders)

```text
ORDER_CREATED → PAYMENT_PENDING → PAYMENT_SECURED → FARMER_ACCEPTED
→ DELIVERY_IN_PROGRESS → DELIVERY_CONFIRMED → SETTLEMENT_PENDING → SETTLED
```

Dispute/refund/cancel branches defined in `VALID_ORDER_TRANSITIONS` (`packages/types`).

## Reference

- Full topology: `docs/architecture.md`
- Domain entities: `docs/domain-model.md`
- Feature specs: `docs/issues/`
- Roadmap: `docs/roadmap.md`
