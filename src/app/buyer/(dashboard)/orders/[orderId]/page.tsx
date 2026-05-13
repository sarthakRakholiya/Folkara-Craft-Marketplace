import { OrderDetailView } from "@/features/buyerDashboard/views/OrderDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details | Folkara",
  description: "Detailed information about your artisan piece.",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderDetailView orderId={orderId} />;
}
