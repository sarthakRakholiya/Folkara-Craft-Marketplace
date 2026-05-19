import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/features/products/actions/product.actions";
import { ProductDetailView } from "@/features/products/views/ProductDetailView";
import { checkIsFavorited } from "@/features/products/actions/favorite.actions";


interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductByIdAction(id);

  if (!data) {
    return {
      title: "Product Not Found | Folkara",
    };
  }

  const { product, shop } = data;
  const images = product.images.map((img) => img.url);

  return {
    title: `${product.title} | ${shop.name} on Folkara`,
    description: product.description,
    keywords: product.tags ?? [],
    openGraph: {
      title: product.title ?? "Product",
      description: product.description ?? "",
      images: images.length > 0 ? [images[0]] : ["/og-image.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title ?? "Product",
      description: product.description ?? "",
      images: images.length > 0 ? [images[0]] : ["/og-image.png"],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await getProductByIdAction(id);

  if (!data) {
    notFound();
  }

  const isFavorite = await checkIsFavorited(id);

  return <ProductDetailView initialData={data} isFavorite={isFavorite} />;
}
