import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  if (session.role !== "BUYER") {
    // Prevent seller from accessing buyer dashboard routes
    redirect("/seller/overview");
  }

  return <>{children}</>;
}
