---
name: request-validation
description: Guides ByteAgroX Zod validation patterns for API and web inputs. Use when adding endpoints, forms, DTOs, query params, or sanitizing user input with @byteagrox/validation schemas.
---

# ByteAgroX Request Validation

## Principle

All inputs sanitized via Zod schemas in `@byteagrox/validation`. No raw request body access in services.

## Schema Location

All shared schemas: `packages/validation/src/index.ts`

Import enums from `@byteagrox/types` — use `z.nativeEnum()` for enum fields.

## Existing Schemas

| Schema | Use Case |
|--------|----------|
| `stellarPublicKeySchema` | Stellar G-address validation |
| `createUserSchema` | Registration |
| `createListingSchema` | Farmer listing creation |
| `createOrderSchema` | Buyer order placement |
| `updateOrderStatusSchema` | Order state transitions |
| `createDisputeSchema` | Dispute filing |

## Adding a New Schema

1. Add to `packages/validation/src/index.ts`
2. Import types/enums from `@byteagrox/types`
3. Export inferred type if needed: `export type CreateOrderDto = z.infer<typeof createOrderSchema>`
4. Use in API controller and optionally in web forms

```typescript
export const createOrderSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  quantity: z.number().positive('Order quantity must be positive'),
});
```

## NestJS Controller Pattern

Parse at the boundary; pass typed DTOs to services:

```typescript
import { createOrderSchema } from '@byteagrox/validation';
import { BadRequestException } from '@nestjs/common';

@Post()
createOrder(@Body() body: unknown) {
  const result = createOrderSchema.safeParse(body);
  if (!result.success) {
    throw new BadRequestException(result.error.flatten());
  }
  return this.ordersService.create(result.data);
}
```

Prefer `safeParse` + explicit 400 over unhandled `ZodError`.

## Web Form Pattern

Reuse the same schema for client-side validation:

```typescript
import { createListingSchema } from '@byteagrox/validation';

const result = createListingSchema.safeParse(formData);
if (!result.success) {
  setErrors(result.error.flatten().fieldErrors);
  return;
}
await api.post('/listings', result.data);
```

## Validation Rules

- UUIDs: `z.string().uuid()`
- Money/quantity: `z.number().positive()` with descriptive messages
- Enums: `z.nativeEnum(OrderStatus)` — never free-text status strings
- Stellar keys: use `stellarPublicKeySchema` or `STELLAR_PUBLIC_KEY_REGEX`
- Optional fields: `.optional()` — avoid `.nullable()` unless DB column is nullable

## Order Status Transitions

`updateOrderStatusSchema` validates shape only. **Also** call `isValidOrderTransition()` in the service — Zod cannot enforce the state graph.

## Reference

- Schemas: `packages/validation/src/index.ts`
- State machine: `packages/types/src/index.ts`
- Security: `docs/security.md`
