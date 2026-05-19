import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getSellerOrdersAction,
  updateOrderStatusAction,
  updateOrderTrackingAction,
  updateOrderPaymentStatusAction,
  updateOrderArtisanNoteAction,
} from "../actions/sellerOrders.actions";
import { toast } from "sonner";

/**
 * Hook to query all incoming order items for the seller's active shop
 */
export function useSellerOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.sellerOrders,
    queryFn: () => getSellerOrdersAction(),
  });
}

/**
 * Hook to update fulfillment status of an order
 */
export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    }) => updateOrderStatusAction(orderId, status),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Order status updated successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      } else {
        toast.error(res.error || "Failed to update order status");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while saving status change.");
    },
  });
}

/**
 * Hook to register tracking code for an order (automatically transitions status to SHIPPED)
 */
export function useUpdateOrderTrackingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) =>
      updateOrderTrackingAction(orderId, trackingNumber),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Tracking coordinates registered!");
        queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      } else {
        toast.error(res.error || "Failed to save tracking number");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while registering tracking.");
    },
  });
}

/**
 * Hook to update transaction payment state
 */
export function useUpdateOrderPaymentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: string;
      paymentStatus: "UNPAID" | "PAID" | "FAILED";
    }) => updateOrderPaymentStatusAction(orderId, paymentStatus),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Payment transaction state updated!");
        queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      } else {
        toast.error(res.error || "Failed to update payment status");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while transitioning payment state.");
    },
  });
}

/**
 * Hook to update the custom artisan narrative/progress update note on the parent order
 */
export function useUpdateOrderArtisanNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      artisanNote,
    }: {
      orderId: string;
      artisanNote: string;
    }) => updateOrderArtisanNoteAction(orderId, artisanNote),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Artisan progress note updated and sent!");
        queryClient.invalidateQueries({ queryKey: queryKeys.sellerOrders });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      } else {
        toast.error(res.error || "Failed to update artisan note");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while saving the artisan update note.");
    },
  });
}
