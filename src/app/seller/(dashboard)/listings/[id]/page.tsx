import { getProductByIdAction } from "@/features/seller/listings/actions/product.actions";
import { ListingDetailView } from "@/features/seller/listings/views/ListingDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdAction(id);
  if (product) {
    return {
      title: `${product.title} | Folkara Artisan Gallery`,
      description: product.description,
    };
  }
  return { title: "Listing Not Found | Folkara" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = await getProductByIdAction(id);

  if (!product) {
    notFound();
  }

  return <ListingDetailView product={product as any} />;
}
