import { BuyerOnboardingView } from "@/features/onboarding/views/BuyerOnboardingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Folkara | Buyer Onboarding",
  description: "Start your journey and discover intentional objects for a slower life.",
};

import { getOnboardingData } from "@/features/onboarding/actions/onboarding.action";

export default async function BuyerOnboardingPage() {
  const initialData = await getOnboardingData();
  return <BuyerOnboardingView initialData={initialData || undefined} />;
}
