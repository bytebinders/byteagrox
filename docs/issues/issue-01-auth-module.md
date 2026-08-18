# feat(auth): Implement User Authentication & Role-Based Session Guard in API

## Description
Establish JWT/session-based authentication in `apps/api` using NestJS guards and `@byteagrox/auth`.

## Context
ByteAgroX requires secure authentication for Farmers, Buyers, Admins, and Agents. This issue establishes the auth boundary and role guards for the NestJS REST API.

## Tasks
- [ ] Implement `AuthModule`, `AuthController`, and `AuthService` in `apps/api/src/auth/`.
- [ ] Add registration (`POST /auth/register`) and login (`POST /auth/login`) endpoints.
- [ ] Create user profile automatically (`FarmerProfile` or `BuyerProfile`) based on `UserRole`.
- [ ] Implement `@UseGuards(RolesGuard)` decorator using `@byteagrox/auth` role helper.
- [ ] Add password hashing via `bcrypt` / `argon2` and JWT payload signing.

## Acceptance Criteria
- [ ] `POST /auth/register` validates input via `createUserSchema` from `@byteagrox/validation`.
- [ ] `POST /auth/login` returns a signed JWT token on valid credentials.
- [ ] Protected routes return `401 Unauthorized` without a token and `403 Forbidden` for insufficient roles.
- [ ] Unit tests added for AuthController and RolesGuard.

## Labels
`enhancement`, `good first issue`, `backend`, `security`
