export type OrderStatus =
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "PENDING"
  | "IN_PROGRESS";

export interface OrderItem {
  id: string;
  orderId?: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  artisan: string;
  orderDate: string;
  arrivalDate?: string;
  deliveredDate?: string;
  trackingNumber?: string;
  rating?: number;
  status: OrderStatus;
  stripeSessionId?: string | null;
}
