import { BuyerView } from "@/features/buyerDashboard/views/BuyerView";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function BuyerOverviewPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  const user = {
    firstName: session.firstName,
    lastName: session.lastName,
    avatarUrl: session.avatarUrl,
  };

  return <BuyerView user={user} />;
}
