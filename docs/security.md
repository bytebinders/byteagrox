# ByteAgroX Security Architecture & Threat Model

## 1. Security Principles

ByteAgroX treats agricultural trade as a high-integrity financial application.

1. **Defense in Depth**: Multi-layer security across Web, API, Database, and Blockchain.
2. **Zero Crypto Exposure**: No secret keys, seeds, or private key material on client devices.
3. **Explicit Financial State Machine**: No arbitrary boolean state updates; state changes follow validated paths.
4. **Idempotency**: All payment and escrow transactions enforce unique idempotency references to prevent double-charging or double-disbursement.

---

## 2. API & Data Security

- **Input Validation**: All incoming requests are validated against Zod schemas in `@byteagrox/validation`.
- **Database Transactions**: Financial updates run inside isolated database transactions with row-level locks.
- **Audit Logging**: Every status transition is immutably logged with actor details in `audit_logs`.
- **Secrets Management**: Secrets (`STELLAR_ESCROW_SECRET_KEY`, `DATABASE_URL`, `JWT_SECRET`) are loaded strictly from environment variables.

---

## 3. Financial Threat Mitigations

| Threat | Mitigation Strategy |
| :--- | :--- |
| **Double Disbursement** | Idempotency keys & database transactional state checks (`SETTLEMENT_PENDING` -> `SETTLED`). |
| **Unapproved State Jump** | `isValidOrderTransition()` strictly enforces valid state flow. |
| **Secret Key Leakage** | All Stellar private keys restricted to backend service (`packages/stellar`), excluded from git via `.gitignore`. |
| **Replay Attacks** | Unique payment reference verification before escrow locking. |
