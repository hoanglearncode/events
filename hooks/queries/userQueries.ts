// hooks/queries/userQueries.ts
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters: any) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  stats: () => [...USER_QUERY_KEYS.all, "stats"] as const,
};

// Get users list with filters
export function useUsersList(filters: {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Get user stats
export function useUsersStats() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.stats(),
    queryFn: () => userService.getUsersStats(),
    staleTime: 60000, // 1 minute
  });
}

// Get single user detail
export function useUserDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userService.getUserDetail(id),
    enabled: !!id && enabled,
    staleTime: 30000,
  });
}
