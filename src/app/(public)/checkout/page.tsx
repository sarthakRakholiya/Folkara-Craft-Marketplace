import { CheckoutView } from "@/features/checkout/views/CheckoutView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Folkara",
  description: "Complete your intentional, slow-living purchase on Folkara.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
