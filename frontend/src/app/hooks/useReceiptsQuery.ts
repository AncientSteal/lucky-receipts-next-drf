import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchReceiptsApi } from "../api/receipts";

export function useReceiptsQuery(page: number, userId?: number) {
  return useQuery({
    // для каждой страницы кэш хранится отдельно
    queryKey: ["receipts", userId, page],
    queryFn: ({ signal }) => fetchReceiptsApi(page, signal),
    // пока грузится другая страница, на экране остаётся текущая, а не пустой экран
    placeholderData: keepPreviousData,
    enabled: Boolean(userId),
  });
}