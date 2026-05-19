import { pgTable, text, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { products } from './products.schema';
import { shops } from './shops.schema';

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'IN_PROGRESS',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'UNPAID',
  'PAID',
  'FAILED'
]);

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('UNPAID').notNull(),
  deliveryMethod: text('delivery_method').notNull(), // 'standard' | 'express'
  
  // Shipping details
  shippingName: text('shipping_name').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  shippingState: text('shipping_state').notNull(),
  shippingCountry: text('shipping_country').notNull(),
  shippingPostalCode: text('shipping_postal_code').notNull(),
  
  // Totals
  shippingCost: numeric('shipping_cost').notNull(),
  subtotal: numeric('subtotal').notNull(),
  tax: numeric('tax').notNull(),
  grandTotal: numeric('grand_total').notNull(),
  
  // Tracking
  trackingNumber: text('tracking_number'),
  artisanNote: text('artisan_note'),
  stripeSessionId: text('stripe_session_id'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  shopId: text('shop_id')
    .notNull()
    .references(() => shops.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations for elegant queries
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  shop: one(shops, {
    fields: [orderItems.shopId],
    references: [shops.id],
  }),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
