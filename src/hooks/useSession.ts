import { useQuery } from "@tanstack/react-query";
import { getSessionData } from "@/features/auth/actions/auth.actions";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => getSessionData(),
    staleTime: 1000 * 30, // 30 seconds
  });
}
