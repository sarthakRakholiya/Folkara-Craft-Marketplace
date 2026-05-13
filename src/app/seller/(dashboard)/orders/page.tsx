import { ComingSoonView } from "@/features/sellerDashboard/components/ComingSoonView";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  return (
    <ComingSoonView 
      title="Orders" 
      icon={ShoppingBag} 
      description="Track your sales, manage shipments, and ensure your crafts reach their new homes."
    />
  );
}
