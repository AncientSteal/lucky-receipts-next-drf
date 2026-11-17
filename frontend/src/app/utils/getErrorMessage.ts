import { ApiError } from "@/app/login/api";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function getErrorMessage(error: unknown, fallback = "Ошибка запроса"): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "Слишком много запросов. Пожалуйста, подождите 1 минуту и попробуйте снова.";
    }
    return error.data.non_field_errors?.[0] || error.data.detail || fallback;
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