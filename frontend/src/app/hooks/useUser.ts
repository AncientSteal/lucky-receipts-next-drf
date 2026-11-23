import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserApi, logoutApi } from "../api/user";

export function useUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: ({ signal }) => fetchUserApi(signal),
    // профиль держим свежим 5 минут
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      // обнулим юзера и удаляем кэш чеков из памяти
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["receipts"] });
    },
  });
}