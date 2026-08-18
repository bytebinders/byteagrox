# feat(marketplace): Create Commodity Listing CRUD Endpoints in NestJS API

## Description
Implement commodity listing endpoints in `apps/api` allowing farmers to post produce offers in Hadejia.

## Context
Listings form the core of the ByteAgroX marketplace catalog, specifying quantity available, unit price in Nigerian Naira (₦), and pickup location in Hadejia.

## Tasks
- [ ] Create `ListingsModule`, `ListingsController`, and `ListingsService` under `apps/api/src/listings/`.
- [ ] Implement `POST /listings` (Create new listing, validate payload with `createListingSchema`).
- [ ] Implement `GET /listings` (Catalog query with optional query params: `categoryId`, `location`, `minPrice`, `maxPrice`).
- [ ] Implement `GET /listings/:id` (Fetch single listing details).
- [ ] Implement `PATCH /listings/:id` (Update availability or price).

## Acceptance Criteria
- [ ] Only authenticated users with `FARMER` role can create or update listings.
- [ ] `GET /listings` supports filtering and pagination.
- [ ] Payload validation enforced via Zod schema from `@byteagrox/validation`.
- [ ] Integration tests added for `ListingsController`.

## Labels
`enhancement`, `backend`, `marketplace`
