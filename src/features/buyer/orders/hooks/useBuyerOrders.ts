import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getBuyerOrdersAction, getBuyerOrderByIdAction } from "../actions/buyerOrders.actions";

/**
 * Hook to retrieve all buyer orders with React Query
 */
export function useBuyerOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => getBuyerOrdersAction(),
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
