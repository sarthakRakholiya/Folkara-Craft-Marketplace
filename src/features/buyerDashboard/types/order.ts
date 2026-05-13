export type OrderStatus = "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "PENDING";

export interface OrderItem {
  id: string;
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
}
