import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

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

      const data: User = await response.json();

      set({ user: data, isLoading: false, isInitialized: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ 
          error: err.message, isLoading: false, isInitialized: true 
        });
      } else {
        set({
          error: "Произошла неизвестная ошибка", isLoading: false, isInitialized: true,
        });
      }
    }
  },
}));
