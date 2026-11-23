import { User, userSchema } from "@/schemas/user.schema";
import { getApiUrl } from "@/app/utils/getApi";
import { getCookieClient } from "@/app/utils/getCookieClient";
import { z } from "zod";

export async function fetchUserApi(signal?: AbortSignal): Promise<User | null> {
  const apiUrl = getApiUrl();
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  const response = await fetch(`${apiUrl}/user/me/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal: combinedSignal,
  });

  // Если пользователь не залогинен возвращаем null
  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Не удалось загрузить профиль");
  }

  const rawData = await response.json();

  try {
    return userSchema.parse(rawData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Бэкенд прислал некорректного пользователя:", err.flatten().fieldErrors);
    }
    throw new Error("Ошибка структуры данных профиля");
  }
}

export async function logoutApi(): Promise<void> {
  const apiUrl = getApiUrl();
  await fetch(`${apiUrl}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookieClient("csrftoken") ?? "",
    },
    credentials: "include",
  });
}