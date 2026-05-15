import { OrderListView } from "@/features/buyer/orders/views/OrderListView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | Folkara",
  description: "View and track your artisan-crafted pieces.",
};

export default function OrdersPage() {
  return <OrderListView />;
}
