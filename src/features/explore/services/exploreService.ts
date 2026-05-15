import { ExploreItem } from '../exploreTypes';
import { getPublicListingsAction } from '../actions/exploreActions';

export const exploreService = {
  getExploreItems: async (params: {
    page: number;
    limit: number;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: "price-asc" | "price-desc" | "newest";
  }): Promise<{ items: ExploreItem[], nextPage: number | null }> => {
    const result = await getPublicListingsAction(params);
    
    if ("error" in result) {
      throw new Error(result.error);
    }

    return {
      items: result.data || [],
      nextPage: result.nextPage
    };
  }
};
