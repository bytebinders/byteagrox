# feat(order): Implement Order Placement & Financial State Transition Engine

## Description
Build the order creation and financial state machine transition service in `apps/api`.

## Context
ByteAgroX enforces an explicit financial state machine (`ORDER_CREATED` ➔ `PAYMENT_PENDING` ➔ `PAYMENT_SECURED` ➔ `FARMER_ACCEPTED` ➔ `DELIVERY_IN_PROGRESS` ➔ `DELIVERY_CONFIRMED` ➔ `SETTLEMENT_PENDING` ➔ `SETTLED`). Random state jumps or boolean flag updates are strictly prohibited.

## Tasks
- [ ] Create `OrdersModule`, `OrdersController`, and `OrdersService` under `apps/api/src/orders/`.
- [ ] Implement `POST /orders` (Creates order in `ORDER_CREATED` status, validates using `createOrderSchema`).
- [ ] Implement `POST /orders/:id/transition` (Executes status transition).
- [ ] Use `isValidOrderTransition(currentStatus, nextStatus)` from `@byteagrox/types` before updating database.
- [ ] Wrap status updates and `audit_logs` record creation inside `db.transaction()`.

## Acceptance Criteria
- [ ] Invalid transitions (e.g. `ORDER_CREATED` ➔ `SETTLED`) return `400 Bad Request` with descriptive message.
- [ ] Valid transitions update order status and append an audit record to `audit_logs`.
- [ ] Database transaction ensures state transition and audit logging are atomic.
- [ ] Unit tests for transition logic covering success and failure paths.

## Labels
`enhancement`, `core`, `financial-engine`, `database`
