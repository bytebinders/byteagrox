import { z } from 'zod';
import { UserRole, OrderStatus } from '@byteagrox/types';

// Regex for Stellar public key format (56 chars starting with G)
export const STELLAR_PUBLIC_KEY_REGEX = /^G[A-D2-7Z]{55}$/;

export const stellarPublicKeySchema = z.string().regex(STELLAR_PUBLIC_KEY_REGEX, {
  message: 'Invalid Stellar public key format. Must be a 56-character string starting with G.',
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.nativeEnum(UserRole),
});

export const createListingSchema = z.object({
  productId: z.string().uuid(),
  quantityAvailable: z.number().positive('Quantity must be greater than zero'),
  pricePerUnitNgn: z.number().positive('Price per unit must be greater than zero'),
  location: z.string().min(2, 'Location is required'),
});

export const createOrderSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  quantity: z.number().positive('Order quantity must be positive'),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  nextStatus: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
});

export const createDisputeSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(10, 'Dispute reason must be detailed (at least 10 characters)'),
  evidenceUrls: z.array(z.string().url()).optional(),
});
