import { ReceiptFormData } from "@/schemas/receipt.schema";
import { getApiUrl } from "../utils/getApi";
import { getCookieClient } from "../utils/getCookieClient";
import { ApiError, BaseValidationErrors } from "../utils/apiError";

export async function createReceipt(payload: ReceiptFormData) {
  const apiUrl = getApiUrl();
  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = AbortSignal.any([controller.signal, timeoutSignal]);

  const response = await fetch(`${apiUrl}/receipts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookieClient("csrftoken") ?? undefined,
    } as Record<string, string>,
    signal: combinedSignal,
    body: JSON.stringify({
      ...payload,
      // сразу к ISO для бэкенда
      purchase_date: payload.purchase_date
        ? new Date(payload.purchase_date).toISOString()
        : "",
    }),
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    throw new ApiError<BaseValidationErrors<ReceiptFormData>>(response.status, { detail: "Сессия истекла. Войдите заново." });
  }

  const result = await response.json();

  if (!response.ok) {
    // Выбрасываем краш, чтобы хук мог обработать
    throw new ApiError<BaseValidationErrors<ReceiptFormData>>(response.status, result);
  }

  return result;
}
