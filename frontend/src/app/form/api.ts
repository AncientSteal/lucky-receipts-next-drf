import { ReceiptFormData } from "@/schemas/receipt.schema";
import { getApiUrl } from "../utils/getApi";
import { getCookieClient } from "../utils/getCookieClient";

// Тип для ошибок валидации DRF, основанный на полях payload + общие ошибки
export type ValidationErrorData = {
  [K in keyof ReceiptFormData]?: string[];
} & {
  non_field_errors?: string[];
  detail?: string; // на случай стандартных ошибок DRF (например, 401 / 403)
};

export class ApiError<T = ValidationErrorData> extends Error {
  public data: T;
  public status: number;
  public isServerError = true;

  constructor(status: number, data: T) {
    super("API Server Error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

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
      purchase_date: payload.purchase_date ? new Date(payload.purchase_date).toISOString() : "",
    }),
    credentials: "include",
  });

  const result = await response.json();
  
  if (!response.ok) {
    // Выбрасываем краш, чтобы хук мог обработать
    throw new ApiError(response.status, result);
  }

  return result;
}