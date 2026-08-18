# feat(database): Add Seed Script for Product Categories & Hadejia Commodity Samples

## Description
Create a database seeding script in `packages/database` that populates initial product categories and sample Hadejia agricultural produce.

## Context
Developers and contributors need sample data (Grains, Legumes, Oilseeds, Paddy Rice, Wheat, Sesame) to test marketplace listing and order flows locally.

## Tasks
- [ ] Create `packages/database/src/seed.ts` script using Drizzle ORM.
- [ ] Add `"db:seed": "tsx src/seed.ts"` to `packages/database/package.json` and `"db:seed": "turbo run db:seed"` to root `package.json`.
- [ ] Seed categories: `Grains`, `Legumes`, `Oilseeds`, `Roots & Tubers`.
- [ ] Seed products: `Hadejia Paddy Rice (50kg)`, `Jigawa White Wheat (100kg)`, `Cleaned Sesame Seeds (50kg)`, `Yellow Maize (100kg)`.

## Acceptance Criteria
- [ ] Running `pnpm db:seed` executes cleanly without duplicate key errors on repeated runs.
- [ ] Seeded items populate foreign key relationships between products and categories correctly.
- [ ] Verification command output printed cleanly in console.

## Labels
`enhancement`, `good first issue`, `database`
