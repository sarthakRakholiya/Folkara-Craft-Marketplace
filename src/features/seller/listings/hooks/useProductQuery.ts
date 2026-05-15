'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getProductByIdAction } from '../actions/product.actions';

/**
 * Hook to fetch a single product by ID.
 * Components should use this instead of calling the action directly.
 */
export function useProductQuery(productId: string) {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProductByIdAction(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
