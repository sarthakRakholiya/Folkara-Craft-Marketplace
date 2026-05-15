import { ProfileView } from "@/features/seller/profile/views/ProfileView";
import { getSellerProfile } from "@/features/auth/actions/profile.actions";

import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getSellerProfile();
  if (!profile) redirect("/auth");
  
  return <ProfileView initialData={profile} />;
}
