# ByteAgroX Domain Model & Financial State Machine

## 1. Domain Entities

ByteAgroX manages 14 primary domain entities:

1. **User**: Core authentication identity (Farmer, Buyer, Admin, Agent).
2. **FarmerProfile**: Farm details, location (Hadejia), farm size, primary crops.
3. **BuyerProfile**: Business entity details, preferred agricultural commodities.
4. **ProductCategory**: Agricultural product categorizations (Grains, Legumes, Oilseeds).
5. **Product**: Specific agricultural goods (e.g., Hadejia Paddy Rice 50kg bag).
6. **Listing**: Farmer offer specifying quantity, unit price (₦ NGN), and location.
7. **Order**: Purchase contract between buyer and farmer.
8. **Escrow**: Held settlement funds securing an order.
9. **Payment**: Inbound/outbound monetary transaction records.
10. **Delivery**: Logistics tracking from pickup to buyer confirmation.
11. **Dispute**: Claim raised by buyer or farmer regarding order quality or non-delivery.
12. **Reputation**: Trust rating calculated from successful/disputed transactions.
13. **Notification**: System alerts sent to users regarding status changes.
14. **AuditLog**: Immutable, append-only log recording every financial state transition.

---

## 2. Order Financial State Machine

ByteAgroX enforces an explicit, auditable financial state machine for every order. Boolean flags (e.g. `isPaid = true`) are strictly forbidden for transaction tracking.

```text
===================================================================
                     SUCCESSFUL SETTLEMENT PATH
===================================================================

[ ORDER_CREATED ]
        │  (Buyer places order for X bags of rice)
        ▼
[ PAYMENT_PENDING ]
        │  (Buyer initiates payment via NGN escrow pool)
        ▼
[ PAYMENT_SECURED ]
        │  (Payment verified; funds locked in Escrow)
        ▼
[ FARMER_ACCEPTED ]
        │  (Farmer confirms availability & prepares dispatch)
        ▼
[ DELIVERY_IN_PROGRESS ]
        │  (Goods dispatched via logistics carrier in Hadejia)
        ▼
[ DELIVERY_CONFIRMED ]
        │  (Buyer inspects & confirms receipt of quality goods)
        ▼
[ SETTLEMENT_PENDING ]
        │  (Stellar settlement payout initiated to farmer)
        ▼
[ SETTLED ]
        └─► (Funds released to farmer; transaction complete)


===================================================================
                     FAILURE & DISPUTE PATHS
===================================================================

PAYMENT_PENDING       ──► PAYMENT_FAILED
                      ──► CANCELLED

PAYMENT_SECURED       ──► CANCELLED (Refunded prior to dispatch)
                      ──► DISPUTED (Goods rejected upon delivery)

FARMER_ACCEPTED       ──► DISPUTED / CANCELLED

DELIVERY_IN_PROGRESS  ──► DISPUTED (Damaged/missing goods)

DISPUTED              ──► REFUNDED (Resolved in buyer's favor)
                      ──► SETTLED (Resolved in farmer's favor)
```

---

## 3. Financial Immutability & Audit Rules

- **State Transitions**: Every state transition MUST check `isValidOrderTransition(currentStatus, newStatus)` before executing.
- **Audit Logging**: Any state transition automatically appends a record to `audit_logs` containing `entity_id`, `previous_state`, `new_state`, `performed_by_user_id`, and `timestamp`.
- **Database Transactions**: Financial status updates and escrow locks MUST run inside an isolated PostgreSQL database transaction (`db.transaction()`).
