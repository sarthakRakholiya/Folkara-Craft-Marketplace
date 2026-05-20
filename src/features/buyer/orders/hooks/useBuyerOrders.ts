import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getBuyerOrdersAction, getBuyerOrderByIdAction } from "../actions/buyerOrders.actions";

/**
 * Hook to retrieve all buyer orders with React Query
 */
export function useBuyerOrdersQuery(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: params ? [...queryKeys.orders, params.page, params.limit, params.status, params.search] : queryKeys.orders,
    queryFn: () => getBuyerOrdersAction(params),
  });
}

/**
 * Hook to retrieve a specific buyer order detail with React Query
 */
export function useBuyerOrderDetailQuery(orderItemId: string) {
  return useQuery({
    queryKey: queryKeys.order(orderItemId),
    queryFn: () => getBuyerOrderByIdAction(orderItemId),
    enabled: !!orderItemId,
  });
}
