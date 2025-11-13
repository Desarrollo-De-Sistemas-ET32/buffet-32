import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/actions/admin';

export const useUsers = (page: number = 1, limit: number = 10, searchQuery?: string) => {
  return useQuery({
    queryKey: ['users', page, limit, searchQuery],
    queryFn: () => getUsers(page, limit, searchQuery),
    staleTime: 5 * 60 * 1000,
  });
};
