import { SellerOrdersView } from "@/features/seller/orders/views/SellerOrdersView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incoming Orders | Folkara Artisan Portal",
  description: "Manage incoming commissions, shipment tracking, and custom narratives.",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 5;
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "ALL";
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";

  return (
    <SellerOrdersView
      page={page}
      limit={limit}
      status={status}
      search={search}
    />
  );
}
