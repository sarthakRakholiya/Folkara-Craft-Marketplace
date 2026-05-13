import { getBuyerProfile } from "@/features/auth/actions/profile.actions";
import { ProfileView } from "@/features/buyerDashboard/views/ProfileView";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getBuyerProfile();

  if (!profile) {
    redirect("/auth");
  }

  return <ProfileView initialData={profile} />;
}
