/**
 * Возвращает базовый URL API в зависимости от среды выполнения (изоморфный хелпер).
 * 
 * - На клиенте (браузер) window определен -> делаем прямой запрос на проброшенный порт хоста (localhost:8000).
 * - На сервере (SSR/Server Components) window === undefined -> делаем запрос внутри Docker-сети по имени сервиса (backend:8000).
 */

export const getApiUrl = () => {
  // Если мы в браузере, window существует -> берем клиентский урл
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  // Если мы на сервере Node.js -> берем внутренний урл Docker-сети
  return process.env.NEXT_SERVER_API_URL || 'http://backend:8000/api';
};