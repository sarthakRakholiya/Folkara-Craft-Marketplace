import { BuyerDashboardView } from "@/features/buyerDashboard/views/BuyerDashboardView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Overview | Folkara",
  description: "Your collection and artisan stories.",
};

export default function BuyerOverviewPage() {
  return <BuyerDashboardView />;
}
