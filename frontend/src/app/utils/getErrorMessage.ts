import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "./apiError";

export function getErrorMessage(error: unknown, fallback = "Ошибка запроса"): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "Слишком много запросов. Пожалуйста, подождите 1 минуту и попробуйте снова.";
    }

    if (error.data.non_field_errors?.[0]) return error.data.non_field_errors[0];
    if (error.data.detail) return error.data.detail;

    // Если общих нет — вытаскиваем первое сообщение из любого поля (например, purchase_date)
    const firstFieldError = Object.values(error.data).flat()[0];
    if (typeof firstFieldError === "string") {
      return firstFieldError;
    }

    return fallback;
  }

  if (error instanceof Error && error.name === "TimeoutError") {
    return "Сервер отвечает слишком долго. Проверьте соединение и попробуйте позже.";
  }

  return "Сетевая ошибка сервера. Попробуйте позже.";
}

export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  if (!(error instanceof ApiError)) return false;

  let hasFieldErrors = false;
  const result = error.data;

  Object.entries(result).forEach(([field, messages]) => {
    if (
      field !== "non_field_errors" &&
      field !== "detail" &&
      Array.isArray(messages) &&
      messages.length > 0
    ) {
      setError(field as Path<T>, { type: "server", message: String(messages[0]) });
      hasFieldErrors = true;
    }
  });

  return hasFieldErrors;
}