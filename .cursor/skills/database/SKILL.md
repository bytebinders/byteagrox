---
name: database
description: Guides ByteAgroX PostgreSQL and Drizzle ORM patterns including schema changes, migrations, transactions, and audit logging. Use when editing database schema, writing queries, migrations, seeds, or financial status updates.
---

# ByteAgroX Database

## Key Paths

| File | Purpose |
|------|---------|
| `packages/database/src/schema/index.ts` | All table definitions (14 entities) |
| `packages/database/src/client.ts` | `db` and `queryClient` exports |
| `packages/database/drizzle.config.ts` | Drizzle Kit config |
| `packages/database/drizzle/` | Generated migrations (after `pnpm db:generate`) |

## Entities

users, farmer_profiles, buyer_profiles, product_categories, products, listings, orders, escrows, payments, deliveries, disputes, reputations, notifications, **audit_logs**

## Schema Conventions

- UUID primary keys: `.defaultRandom()`
- PostgreSQL enums via `pgEnum()` — mirror TS enums in `@byteagrox/types`
- Monetary values: `decimal(precision, scale)` with NGN suffix in TS (`pricePerUnitNgn`)
- Timestamps: `createdAt` / `updatedAt` with `.defaultNow()`
- Foreign keys: `.references(() => table.id)`

## Client Usage

```typescript
import { db, auditLogs, orders } from '@byteagrox/database';
import { eq } from 'drizzle-orm';
```

Connection via `postgres` driver with `prepare: false` (serverless-compatible). `DATABASE_URL` from env.

## Migration Workflow

1. Edit `packages/database/src/schema/index.ts`
2. Sync enum values with `@byteagrox/types` if enums changed
3. Run `pnpm db:generate` from repo root
4. Review generated SQL in `packages/database/drizzle/`
5. Run `pnpm db:migrate`

Never hand-edit applied migrations.

## Financial Updates (Required Pattern)

All order status changes must be atomic:

```typescript
await db.transaction(async (tx) => {
  // 1. Validate transition (before or inside transaction)
  if (!isValidOrderTransition(currentStatus, nextStatus)) {
    throw new Error('Invalid transition');
  }

  // 2. Update entity
  await tx.update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  // 3. Append audit log (immutable)
  await tx.insert(auditLogs).values({
    entityName: 'orders',
    entityId: orderId,
    action: 'ORDER_STATUS_TRANSITION',
    previousState: currentStatus,
    newState: nextStatus,
    performedByUserId: userId,
    metadata: { reason },
  });
});
```

Audit logs are **append-only** — never UPDATE or DELETE from `audit_logs`.

## Enum Sync Checklist

When adding/changing an enum:
- [ ] Update enum in `packages/types/src/index.ts`
- [ ] Update `pgEnum` in schema
- [ ] Update `VALID_ORDER_TRANSITIONS` if order-related
- [ ] Update Zod schemas using `z.nativeEnum()`
- [ ] Generate and run migration

## Reference

- Schema source: `packages/database/src/schema/index.ts`
- Seed spec: `docs/issues/issue-02-database-seed.md`
- Order state machine spec: `docs/issues/issue-04-order-state-machine.md`
