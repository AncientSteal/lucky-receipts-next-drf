/**
 * Чисто КЛИЕНТСКИЙ хелпер для получения куки.
 * Безопасно вызывать в Zustand, useEffect и клиентских компонентах.
 */
export function getCookieClient(name: string): string | null {
  if (typeof window === "undefined") return null;

  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== "") {
    const cookiesList = document.cookie.split(";");
    for (let i = 0; i < cookiesList.length; i++) {
      const cookie = cookiesList[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
  
}
