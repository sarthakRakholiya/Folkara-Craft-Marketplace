import { ComingSoonView } from "@/features/sellerDashboard/components/ComingSoonView";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ComingSoonView 
      title="Analytics" 
      icon={BarChart3} 
      description="Gain deep insights into your shop performance, trending items, and growth trends."
    />
  );
}
