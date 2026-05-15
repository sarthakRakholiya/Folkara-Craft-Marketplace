'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { updateProductStockAction, deleteProductAction } from '../actions/product.actions';
import { toast } from 'sonner';

/**
 * Mutation hook for updating product stock.
 */
export function useUpdateProductStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productId: string; newQuantity: number }) => 
      updateProductStockAction(data),
    onSuccess: (result, variables) => {
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Stock updated successfully');
    },
  });
}

/**
 * Mutation hook for deleting a product.
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProductAction(productId),
    onSuccess: (result) => {
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Listing deleted');
    },
  });
}
