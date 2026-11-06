import { create } from "zustand";
import { z } from 'zod';

// Схема — единственный источник правды для данных пользователя
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
});

// Автоматически получаем тип User для стейта
export type User = z.infer<typeof userSchema>;

interface UserState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  logout: () => set({ user: null, error: null, isInitialized: false }),

  fetchUser: async () => {
    // Если код пытается выполнить это на сервере Next.js - мгновенно выходим
    if (typeof window === 'undefined') return;
    if (get().isLoading || get().isInitialized) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${apiUrl}/user/me/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Не удалось загрузить профиль");

      const rawData = await response.json();
      const validatedUser = userSchema.parse(rawData);

      set({ user: validatedUser, isLoading: false, isInitialized: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Произошла неизвестная ошибка";
      
      if (err instanceof z.ZodError) {
        const formattedErrors = z.treeifyError(err);
        console.error("Бэкенд прислал некорректного пользователя:", formattedErrors);
      }

      set({ error: errorMessage, isLoading: false, isInitialized: true });
    }
  },
}));
