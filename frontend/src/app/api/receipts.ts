import { PaginatedReceipts, paginatedReceiptsSchema } from "@/schemas/receipt.schema";
import { getApiUrl } from "@/app/utils/getApi";
import { z } from "zod";

export async function fetchReceiptsApi(
  page: number,
  signal?: AbortSignal,
): Promise<PaginatedReceipts> {
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/receipts/?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: combinedSignal,
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error("Необходима авторизация");
    }

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const rawData = await response.json();
    return paginatedReceiptsSchema.parse(rawData);
  } catch (error: unknown) {
    if (
      (combinedSignal.aborted &&
        combinedSignal.reason?.name === "TimeoutError") ||
      (error instanceof Error && error.name === "TimeoutError")
    ) {
      throw new Error("Превышено время ожидания");
    }

    if (error instanceof z.ZodError) {
      console.error(
        "Ошибка структуры данных API чеков:",
        error.flatten().fieldErrors,
      );
      throw new Error("Ошибка структуры данных API чеков.");
    }

    throw error;
  }
}
