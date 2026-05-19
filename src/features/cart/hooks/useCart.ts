"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getCartItemsAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeFromCartAction,
  clearCartAction,
} from "../actions/cart.actions";
import { toggleFavorite } from "@/features/products/actions/favorite.actions";
import { exploreService } from "@/features/explore/services/exploreService";
import { toast } from "sonner";

/**
 * Hook to query shopping bag items from the database
 */
export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => getCartItemsAction(),
  });
}

/**
 * Hook to add a product to the cart
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      addToCartAction(productId, quantity),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Added to shopping bag");
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
    onError: (err) => {
      console.error("Failed to add to cart:", err);
      toast.error(err instanceof Error ? err.message : "Could not add item to bag");
    },
  });
}

type CartItems = Awaited<ReturnType<typeof getCartItemsAction>>;

/**
 * Hook to update a cart item's quantity with highly fluid Optimistic Updates
 */
export function useUpdateQuantityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemQuantityAction(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      // Cancel outgoing queries for cart key so they don't overwrite our update
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Save previous state for rollback
      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically update query cache immediately
      queryClient.setQueryData(queryKeys.cart, (old: CartItems | undefined) => {
        if (!old) return [];
        
        // If updating to 0 or negative, optimistically remove the item
        if (quantity <= 0) {
          return old.filter((item) => item.id !== itemId);
        }

        return old.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      // Revert cache to snapshot on network / database error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error("Failed to update item quantity");
    },

    onSettled: () => {
      // Invalidate to sync eventual consistency with DB
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to remove a cart item with fully complete Optimistic Updates
 */
export function useRemoveItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeFromCartAction(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically filter out item immediately
      queryClient.setQueryData(queryKeys.cart, (old: CartItems | undefined) => {
        if (!old) return [];
        return old.filter((item) => item.id !== itemId);
      });

      return { previousCart };
    },

    onSuccess: () => {
      toast.success("Removed from shopping bag");
    },

    onError: (err, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error("Failed to remove item");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to clear all cart items with fully complete Optimistic Updates
 */
export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCartAction(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      const previousCart = queryClient.getQueryData(queryKeys.cart);

      // Optimistically empty the array
      queryClient.setQueryData(queryKeys.cart, []);

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error("Failed to empty bag");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to move a product from saved for later list straight into the cart
 */
export function useMoveToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // 1. Add to cart
      const addResult = await addToCartAction(productId, 1);
      if (!addResult.success) throw new Error("Could not add item to bag");

      // 2. Remove from favorites (wishlist)
      const favResult = await toggleFavorite(productId);
      if (favResult.error) throw new Error(favResult.error);

      return { productId };
    },
    onSuccess: () => {
      toast.success("Moved item to shopping bag");
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to move item to bag");
    },
  });
}

/**
 * Hook to query catalog recommendations for the shopping bag page
 */
export function useCartRecommendationsQuery() {
  return useQuery({
    queryKey: ["cart-recommendations"],
    queryFn: async () => {
      const res = await exploreService.getExploreItems({ page: 1, limit: 3 });
      return res.items;
    },
  });
}


