import { cookies } from "next/headers";

/**
 * Чисто СЕРВЕРНЫЙ асинхронный хелпер для получения куки.
 * Можно вызывать ТОЛЬКО в Server Components, Server Actions или Route Handlers.
 */
export async function getCookieServer(name: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value ?? null;
  } catch (error) {
    console.error("Ошибка чтения куки на сервере:", error);
    return null;
  }
}