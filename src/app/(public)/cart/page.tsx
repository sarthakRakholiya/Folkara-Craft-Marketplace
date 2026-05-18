import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { CartView } from "@/features/cart/views/CartView";

export const metadata: Metadata = {
  title: "Your Shopping Bag | Folkara",
  description: "Review and checkout slow-made, handcrafted Indian artifacts from your bag.",
};

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    // Unauthenticated -> redirect to authentication portal with next callback
    redirect("/auth?next=/cart");
  }

  return <CartView />;
}
