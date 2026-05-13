import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SELLER_NAV_ITEMS } from "@/constants/navigation";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell 
      navItems={SELLER_NAV_ITEMS} 
      rootHref="/seller/overview"
    >
      {children}
    </DashboardShell>
  );
}
