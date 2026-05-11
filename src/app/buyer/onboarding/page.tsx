import { BuyerOnboardingView } from "@/features/onboarding/views/BuyerOnboardingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Folkara | Buyer Onboarding",
  description: "Start your journey and discover intentional objects for a slower life.",
};

export default function BuyerOnboardingPage() {
  return <BuyerOnboardingView />;
}
