import { ComingSoonView } from "@/components/dashboard/ComingSoonView";
import { Wallet } from "lucide-react";

export default function PayoutsPage() {
  return (
    <ComingSoonView 
      title="Payouts" 
      icon={Wallet} 
      description="Manage your earnings, view transaction history, and configure your payment methods."
    />
  );
}
