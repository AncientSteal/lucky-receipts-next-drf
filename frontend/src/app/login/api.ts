import { LoginFormData, RegisterFormData, User, userSchema } from "@/schemas/user.schema";
import { getApiUrl } from "../utils/getApi";
import { getCookieClient } from "../utils/getCookieClient";
import { ApiError, BaseValidationErrors } from "../utils/apiError";

// Проверяем, что в браузере есть кука csrftoken перед отправкой POST
async function ensureCsrfToken(apiUrl: string): Promise<string> {
  let token = getCookieClient("csrftoken");
  if (!token) {
    await fetch(`${apiUrl}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
    });
    token = getCookieClient("csrftoken");
  }
  return token || "";
}

export async function sendAuthRequest(endpoint: string, payload: unknown): Promise<User> {
  const apiUrl = getApiUrl();
  const csrfToken = await ensureCsrfToken(apiUrl);
  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = AbortSignal.any([controller.signal, timeoutSignal]);

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken
    },
    signal: combinedSignal,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new ApiError<BaseValidationErrors<LoginFormData>>(response.status, result);
  }

  return userSchema.parse(result);
}

export const loginUser = (payload: LoginFormData) =>
  sendAuthRequest("/auth/login/", payload);

export const registerUser = (payload: RegisterFormData) =>
  sendAuthRequest("/auth/register/", payload);