import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/features/sellerDashboard/components/DashboardShell";

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Basic check - middleware should handle this but layout adds extra layer
  if (!session || session.role !== "SELLER") {
    redirect("/auth");
  }

  const user = {
    firstName: session.firstName,
    lastName: session.lastName,
    avatarUrl: session.avatarUrl,
    shopName: session.shopName,
  };

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
