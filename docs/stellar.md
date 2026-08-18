# ByteAgroX Stellar Integration Guide

## 1. Invisible Web3 UX Philosophy

ByteAgroX utilizes Stellar as backend settlement infrastructure. Farmers and buyers in Hadejia interact exclusively with local fiat amounts (Nigerian Naira ₦), clear trade milestones, and traditional notifications.

```text
Buyer Flow:
1. Selects 50 bags of Hadejia Rice (₦1,200,000)
2. Pays ₦1,200,000 via local escrow account
3. Receives delivery confirmation code
4. Confirms delivery upon arrival -> Payment released to Farmer
```

Underneath the hood, ByteAgroX records and anchors escrow locks and settlement payouts on the Stellar network.

---

## 2. Technical Architecture

All Stellar operations are contained strictly within `@byteagrox/stellar`:

- `StellarClient`: Manages Horizon server connection for Testnet (`https://horizon-testnet.stellar.org`).
- `WalletService`: Generates keypairs and funds accounts via Testnet Friendbot.
- `PaymentService`: Builds payment operations.
- `EscrowService`: Prepares multi-signature or claimable balance escrow accounts.
- `TransactionService`: Checks status of submitted transaction hashes.

---

## 3. Stellar Testnet Configuration

Environment variables:
```bash
STELLAR_NETWORK=TESTNET
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_FRIENDBOT_URL=https://friendbot.stellar.org
STELLAR_ESCROW_PUBLIC_KEY=G...
STELLAR_ESCROW_SECRET_KEY=S... # Secret key (keep in .env only, never commit)
```

---

## 4. Key Management & Security Rules

1. **No Hardcoded Keys**: Public and secret keys are never placed directly in source code.
2. **Testnet Only**: Development is configured exclusively against Stellar Testnet.
3. **Keypair Isolation**: User seeds/keys are never exposed in Next.js web application bundles.
