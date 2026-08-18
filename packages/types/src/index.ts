/**
 * ByteAgroX Domain Types & Financial State Machine Enums
 */

export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

/**
 * Strict, auditable Order Financial State Machine
 */
export enum OrderStatus {
  ORDER_CREATED = 'ORDER_CREATED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SECURED = 'PAYMENT_SECURED',
  FARMER_ACCEPTED = 'FARMER_ACCEPTED',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERY_CONFIRMED = 'DELIVERY_CONFIRMED',
  SETTLEMENT_PENDING = 'SETTLEMENT_PENDING',
  SETTLED = 'SETTLED',
  // Failure / Dispute states
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum EscrowStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum DisputeStatus {
  NONE = 'NONE',
  OPENED = 'OPENED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED_BUYER_REFUND = 'RESOLVED_BUYER_REFUND',
  RESOLVED_FARMER_RELEASE = 'RESOLVED_FARMER_RELEASE',
  DISMISSED = 'DISMISSED',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmLocation: string; // e.g., Hadejia, Jigawa State
  farmSizeHectares?: number;
  primaryCrops: string[]; // e.g., Rice, Wheat, Sesame, Maize
  bankAccountDetails?: string;
  stellarPublicKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  businessName?: string;
  businessAddress?: string;
  preferredProducts: string[];
  stellarPublicKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string; // e.g., Grains, Legumes, Oilseeds
  description?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string; // e.g., Hadejia Harvested Paddy Rice
  unit: string; // e.g., Bag (50kg), Metric Ton
  description?: string;
  createdAt: Date;
}

export interface Listing {
  id: string;
  farmerId: string;
  productId: string;
  quantityAvailable: number;
  pricePerUnitNgn: number; // Price in Nigerian Naira (₦)
  location: string; // Hadejia market hub
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  farmerId: string;
  quantity: number;
  totalAmountNgn: number; // Total amount in ₦
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Escrow {
  id: string;
  orderId: string;
  amountNgn: number;
  stellarEscrowAddress?: string; // Multi-sig or time-locked Stellar account/claimable balance
  stellarTxHash?: string;
  status: EscrowStatus;
  lockedAt?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  escrowId?: string;
  amountNgn: number;
  paymentMethod: string; // e.g., Bank Transfer, NGN Escrow, Stellar Settlement
  status: PaymentStatus;
  reference: string;
  createdAt: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  carrierName?: string;
  trackingCode?: string;
  pickupLocation: string;
  deliveryLocation: string;
  status: DeliveryStatus;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedByUserId: string;
  reason: string;
  evidenceUrls?: string[];
  status: DisputeStatus;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: string; // e.g., ORDER_STATUS_TRANSITION
  previousState?: string;
  newState?: string;
  performedByUserId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Valid order state transitions graph
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.ORDER_CREATED]: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
  [OrderStatus.PAYMENT_PENDING]: [OrderStatus.PAYMENT_SECURED, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED],
  [OrderStatus.PAYMENT_SECURED]: [OrderStatus.FARMER_ACCEPTED, OrderStatus.DISPUTED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.FARMER_ACCEPTED]: [OrderStatus.DELIVERY_IN_PROGRESS, OrderStatus.DISPUTED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.DELIVERY_IN_PROGRESS]: [OrderStatus.DELIVERY_CONFIRMED, OrderStatus.DISPUTED],
  [OrderStatus.DELIVERY_CONFIRMED]: [OrderStatus.SETTLEMENT_PENDING, OrderStatus.DISPUTED],
  [OrderStatus.SETTLEMENT_PENDING]: [OrderStatus.SETTLED, OrderStatus.DISPUTED],
  [OrderStatus.SETTLED]: [],
  [OrderStatus.PAYMENT_FAILED]: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
  [OrderStatus.DISPUTED]: [OrderStatus.REFUNDED, OrderStatus.SETTLEMENT_PENDING, OrderStatus.SETTLED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
};

export function isValidOrderTransition(current: OrderStatus, next: OrderStatus): boolean {
  return VALID_ORDER_TRANSITIONS[current]?.includes(next) ?? false;
}
