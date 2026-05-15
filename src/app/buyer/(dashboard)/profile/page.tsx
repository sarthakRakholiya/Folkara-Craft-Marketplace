import { getBuyerProfile } from "@/features/auth/actions/profile.actions";
import { ProfileView } from "@/features/buyer/profile/views/ProfileView";
import { redirect } from "next/navigation";
import type { BuyerProfileViewData } from "@/features/buyer/profile/types/profile.types";

export default async function ProfilePage() {
  const profile = await getBuyerProfile();

  if (!profile) {
    redirect("/auth");
  }

  return <ProfileView initialData={profile as unknown as BuyerProfileViewData} />;
}
