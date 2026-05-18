'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { checkIsFavorited, toggleFavorite } from '../actions/favorite.actions';
import { toast } from 'sonner';

/**
 * Hook to query whether a product is in the user's "Save for Later" collection.
 * Handled gracefully if the user is logged out (returns initialData or false).
 */
export function useFavoriteQuery(productId: string, initialData?: boolean) {
  return useQuery({
    queryKey: queryKeys.favorite(productId),
    queryFn: async () => {
      return await checkIsFavorited(productId);
    },
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation hook to toggle the favorite status.
 */
export function useToggleFavoriteMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFavorite(productId),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      const saved = result.data?.isFavorited ?? false;
      queryClient.setQueryData(queryKeys.favorite(productId), saved);
      
      // Also invalidate products queries if they show badges
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      if (saved) {
        toast.success('Saved for later');
      } else {
        toast.success('Removed from Save for Later');
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to update favorite status');
    },
  });
}
