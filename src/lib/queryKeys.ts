/**
 * @file queryKeys.ts
 * Central registry of all React Query cache keys.
 * Always use these — never inline string arrays in components.
 */
export const queryKeys = {
  buyerProfile: ["buyer", "profile"] as const,
  sellerProfile: ["seller", "profile"] as const,
  shop: (id: string) => ["shop", id] as const,
  products: ["products"] as const,
  product: (id: string) => ["product", id] as const,
  onboarding: ["onboarding"] as const,
  favorite: (productId: string) => ["favorite", productId] as const,
  favorites: ["favorites"] as const,
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  sellerOrders: ["seller", "orders"] as const,
} as const;


