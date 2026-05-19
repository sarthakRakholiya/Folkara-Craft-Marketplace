import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopProfile } from "@/features/shop/actions/shop.actions";
import { ShopProfileView } from "@/features/shop/views/ShopProfileView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getShopProfile(id);

  if (!profile) {
    return {
      title: "Artisan Profile Not Found | Folkara",
    };
  }

  const { shop, seller } = profile;
  const artisanName = seller 
    ? `${seller.firstName} ${seller.lastName}`.trim() 
    : "Master Artisan";

  return {
    title: `${shop.name} | Handcrafted by ${artisanName} on Folkara`,
    description: shop.description || `${shop.name} is a certified slow-made artisan studio on Folkara. Discover beautiful handcrafted collections and read the artisan's journey.`,
    openGraph: {
      title: `${shop.name} | Folkara Artisan Profile`,
      description: shop.description || `${shop.name} is a certified slow-made artisan studio on Folkara.`,
      images: [shop.logoUrl || "/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${shop.name} | Folkara Artisan Profile`,
      description: shop.description || `${shop.name} is a certified slow-made artisan studio on Folkara.`,
      images: [shop.logoUrl || "/og-image.png"],
    },
  };
}

export default async function ShopProfilePage({ params }: Props) {
  const { id } = await params;
  const profile = await getShopProfile(id);

  if (!profile) {
    notFound();
  }

  return <ShopProfileView initialData={profile} />;
}
