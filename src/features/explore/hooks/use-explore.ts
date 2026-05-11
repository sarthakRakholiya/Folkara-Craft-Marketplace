import { useQuery } from '@tanstack/react-query';
import { exploreService } from '../services/explore.service';

export const useExplore = () => {
  return useQuery({
    queryKey: ['explore-items'],
    queryFn: exploreService.getExploreItems,
  });
};
