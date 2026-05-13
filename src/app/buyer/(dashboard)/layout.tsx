import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BUYER_NAV_ITEMS } from "@/constants/navigation";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell 
      navItems={BUYER_NAV_ITEMS} 
      rootHref="/buyer/overview"
    >
      {children}
    </DashboardShell>
  );
}
