import { OnboardingView } from "@/features/onboarding/views/OnboardingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Onboarding | Folkara",
  description: "Start your journey as a Folkara artisan.",
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
