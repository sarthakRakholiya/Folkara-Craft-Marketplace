import { OnboardingView } from "@/features/onboarding/views/OnboardingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Onboarding | Folkara",
  description: "Start your journey as a Folkara artisan.",
};

import { getOnboardingData } from "@/features/onboarding/actions/onboarding.action";

export default async function OnboardingPage() {
  const initialData = await getOnboardingData();
  return <OnboardingView initialData={initialData || undefined} />;
}
