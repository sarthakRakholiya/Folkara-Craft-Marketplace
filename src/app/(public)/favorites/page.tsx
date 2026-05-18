import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserFavorites } from "@/features/products/actions/favorite.actions";
import { FavoritesView } from "@/features/products/views/FavoritesView";


export const metadata: Metadata = {
  title: "Saved Objects | Folkara",
  description:
    "Your collection of slow-made, handcrafted Indian artifacts saved for later.",
};

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session) {
    // Unauthenticated -> redirect to authentication portal with next callback
    redirect("/auth?next=/favorites");
  }

  // Pre-fetch favorites list for active user
  const products = await getUserFavorites();

  return <FavoritesView initialProducts={products} />;
}
