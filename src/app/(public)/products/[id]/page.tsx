import { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/features/products/services/product.service";
import { ProductDetailView } from "@/features/products/views/ProductDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await productService.getProductById(id);

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
    openGraph: {
      title: product.title ?? "Product",
      description: product.description ?? "",
      images: images.length > 0 ? [images[0]] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title ?? "Product",
      description: product.description ?? "",
      images: images.length > 0 ? [images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await productService.getProductById(id);

  if (!data) {
    notFound();
  }

  return <ProductDetailView initialData={data} />;
}
