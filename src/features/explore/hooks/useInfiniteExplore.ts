import { useInfiniteQuery } from '@tanstack/react-query';
import { exploreService } from '../services/exploreService';

interface UseInfiniteExploreProps {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  limit?: number;
}

export const useInfiniteExplore = ({
  categories,
  minPrice,
  maxPrice,
  search,
  sort,
  limit = 20
}: UseInfiniteExploreProps) => {
  return useInfiniteQuery({
    queryKey: ['explore-items', { categories, minPrice, maxPrice, search, sort }],
    queryFn: ({ pageParam = 1 }) => 
      exploreService.getExploreItems({
        page: pageParam as number,
        limit,
        categories,
        minPrice,
        maxPrice,
        search,
        sort
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
