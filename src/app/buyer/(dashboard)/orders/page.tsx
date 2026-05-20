import { OrderListView } from "@/features/buyer/orders/views/OrderListView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | Folkara",
  description: "View and track your artisan-crafted pieces.",
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

  return <OrderListView page={page} limit={limit} status={status} search={search} />;
}
