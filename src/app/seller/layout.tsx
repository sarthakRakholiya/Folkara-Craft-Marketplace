import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  if (session.role !== "SELLER") {
    // Prevent buyer from accessing seller dashboard routes
    redirect("/buyer/overview");
  }

  return <>{children}</>;
}
