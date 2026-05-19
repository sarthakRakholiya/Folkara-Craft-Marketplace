import { InventoryView } from "@/features/seller/listings/views/InventoryView";
import { getSellerListingsAction, getInventoryStatsAction } from "@/features/seller/listings/actions/inventory.actions";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  ProductStatus,
  SortOption,
} from "@/features/seller/listings/types/inventory.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const shop = await db.query.shops.findFirst({
    where: (shops, { eq }) => eq(shops.userId, session.userId),
  });

  if (!shop) redirect("/seller/profile");

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const status = (resolvedSearchParams.status as ProductStatus) || "all";
  const sort = (resolvedSearchParams.sort as SortOption) || "recently-added";

  // Fetch listings and stats in parallel to avoid waterfalls
  const [productsData, stats] = await Promise.all([
    getSellerListingsAction({
      shopId: shop.id,
      page,
      limit: 8,
      status: resolvedSearchParams.status as any,
      sort: resolvedSearchParams.sort as any,
    }),
    getInventoryStatsAction(shop.id)
  ]);

  const { products, totalPages, totalCount } = productsData;
  return (
    <InventoryView
      initialProducts={products}
      totalPages={totalPages}
      totalCount={totalCount}
      stats={stats}
      currentParams={{
        page,
        status,
        sort,
      }}
    />
  );
}
