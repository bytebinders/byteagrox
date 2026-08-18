import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  decimal,
  timestamp,
  pgEnum,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['FARMER', 'BUYER', 'ADMIN', 'AGENT']);

export const orderStatusEnum = pgEnum('order_status', [
  'ORDER_CREATED',
  'PAYMENT_PENDING',
  'PAYMENT_SECURED',
  'FARMER_ACCEPTED',
  'DELIVERY_IN_PROGRESS',
  'DELIVERY_CONFIRMED',
  'SETTLEMENT_PENDING',
  'SETTLED',
  'PAYMENT_FAILED',
  'DISPUTED',
  'CANCELLED',
  'REFUNDED',
]);

export const escrowStatusEnum = pgEnum('escrow_status', [
  'PENDING',
  'HELD',
  'RELEASED',
  'REFUNDED',
  'DISPUTED',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
]);

export const deliveryStatusEnum = pgEnum('delivery_status', [
  'PENDING',
  'IN_TRANSIT',
  'DELIVERED',
  'VERIFIED',
  'REJECTED',
]);

export const disputeStatusEnum = pgEnum('dispute_status', [
  'NONE',
  'OPENED',
  'UNDER_REVIEW',
  'RESOLVED_BUYER_REFUND',
  'RESOLVED_FARMER_RELEASE',
  'DISMISSED',
]);

// 1. Users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('FARMER'),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Farmer Profiles
export const farmerProfiles = pgTable('farmer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  farmLocation: text('farm_location').notNull(),
  farmSizeHectares: decimal('farm_size_hectares', { precision: 10, scale: 2 }),
  primaryCrops: text('primary_crops').array(),
  bankAccountDetails: text('bank_account_details'),
  stellarPublicKey: varchar('stellar_public_key', { length: 56 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Buyer Profiles
export const buyerProfiles = pgTable('buyer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  businessName: varchar('business_name', { length: 255 }),
  businessAddress: text('business_address'),
  preferredProducts: text('preferred_products').array(),
  stellarPublicKey: varchar('stellar_public_key', { length: 56 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Product Categories
export const productCategories = pgTable('product_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Products
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => productCategories.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Listings
export const listings = pgTable('listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  farmerId: uuid('farmer_id').references(() => farmerProfiles.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantityAvailable: decimal('quantity_available', { precision: 12, scale: 2 }).notNull(),
  pricePerUnitNgn: decimal('price_per_unit_ngn', { precision: 12, scale: 2 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Orders
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  listingId: uuid('listing_id').references(() => listings.id).notNull(),
  buyerId: uuid('buyer_id').references(() => buyerProfiles.id).notNull(),
  farmerId: uuid('farmer_id').references(() => farmerProfiles.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  totalAmountNgn: decimal('total_amount_ngn', { precision: 14, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('ORDER_CREATED'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Escrows
export const escrows = pgTable('escrows', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull().unique(),
  amountNgn: decimal('amount_ngn', { precision: 14, scale: 2 }).notNull(),
  stellarEscrowAddress: varchar('stellar_escrow_address', { length: 56 }),
  stellarTxHash: varchar('stellar_tx_hash', { length: 128 }),
  status: escrowStatusEnum('status').notNull().default('PENDING'),
  lockedAt: timestamp('locked_at'),
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 9. Payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  escrowId: uuid('escrow_id').references(() => escrows.id),
  amountNgn: decimal('amount_ngn', { precision: 14, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('PENDING'),
  reference: varchar('reference', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Deliveries
export const deliveries = pgTable('deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull().unique(),
  carrierName: varchar('carrier_name', { length: 255 }),
  trackingCode: varchar('tracking_code', { length: 100 }),
  pickupLocation: text('pickup_location').notNull(),
  deliveryLocation: text('delivery_location').notNull(),
  status: deliveryStatusEnum('status').notNull().default('PENDING'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Disputes
export const disputes = pgTable('disputes', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull().unique(),
  raisedByUserId: uuid('raised_by_user_id').references(() => users.id).notNull(),
  reason: text('reason').notNull(),
  evidenceUrls: text('evidence_urls').array(),
  status: disputeStatusEnum('status').notNull().default('OPENED'),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 12. Reputation
export const reputations = pgTable('reputations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  score: decimal('score', { precision: 5, scale: 2 }).default('5.00').notNull(),
  totalTransactions: integer('total_transactions').default(0).notNull(),
  successfulTransactions: integer('successful_transactions').default(0).notNull(),
  disputedTransactions: integer('disputed_transactions').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 13. Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Audit Logs (Immutable Transaction History)
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  entityName: varchar('entity_name', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  previousState: text('previous_state'),
  newState: text('new_state'),
  performedByUserId: uuid('performed_by_user_id').references(() => users.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
