# feat(stellar): Connect WalletService & EscrowService to Stellar Testnet Horizon API

## Description
Connect Stellar services in `@byteagrox/stellar` to Horizon Testnet endpoints and expose health checks in API.

## Context
Stellar acts as backend settlement infrastructure for ByteAgroX. Testnet keypair generation, Friendbot funding, and claimable balance escrow initialization need to be operational.

## Tasks
- [ ] Connect `StellarClient` in `packages/stellar` to Horizon Testnet (`https://horizon-testnet.stellar.org`).
- [ ] Extend `WalletService.fundTestnetAccount(publicKey)` with retry handling for Friendbot requests.
- [ ] Implement `EscrowService.initializeEscrow()` mock transaction builder using `@stellar/stellar-sdk` Testnet network passphrase.
- [ ] Expose `GET /stellar/health` in `apps/api` calling `StellarClient.checkHealth()`.

## Acceptance Criteria
- [ ] `GET /stellar/health` returns status `OK` with network passphrase and Horizon URL.
- [ ] `WalletService.isValidPublicKey()` correctly validates 56-character `G...` keys.
- [ ] All Stellar secret keys are handled exclusively via environment variables and never exposed in client bundles or logs.
- [ ] Unit tests added for `WalletService` and `EscrowService`.

## Labels
`enhancement`, `blockchain`, `stellar`, `testnet`
