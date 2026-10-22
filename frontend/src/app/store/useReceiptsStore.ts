import { ExtendedReceipt } from "@/components/ReceiptList";
import { create } from "zustand";

export interface Receipt {
  id: number;
  fn: string;
  fd: string;
  fp: string;
  purchase_date: string;
  amount: number;
}

interface ReceiptsState {
  receipts: ExtendedReceipt[];
  count: number;
  page: number;
  loading: boolean;
  error: string | null;
  abortController: AbortController | null;
  setPage: (newPage: number) => void;
  fetchReceipts: (pageNumber?: number) => Promise<void>;
}

export const useReceiptsStore = create<ReceiptsState>((set, get) => ({
  receipts: [],
  count: 0,
  page: 1,
  loading: false,
  error: null,
  abortController: null,

  setPage: (newPage: number) => {
    set({ page: newPage });
    get().fetchReceipts();
  },

  fetchReceipts: async (pageNumber?: number) => {
    const targetPage = pageNumber ?? get().page;
    if (pageNumber) set({ page: pageNumber });

    // Отменяем предыдущий запрос чеков, если пользователь быстро кликает пагинацию
    if (get().abortController) {
      get().abortController?.abort();
    }

    const controller = new AbortController();
    const timeoutSignal = AbortSignal.timeout(5000);
    const combinedSignal = AbortSignal.any([controller.signal, timeoutSignal]);

    set({ loading: true, error: null, abortController: controller });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
      const response = await fetch(`${apiUrl}/receipts/?page=${targetPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: combinedSignal,
      });

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const data = await response.json();
      set({
        receipts: data.results,
        count: data.count,
        loading: false,
        abortController: null,
      });
    } catch (error: unknown) {
      const isTimeout = combinedSignal && combinedSignal.aborted && combinedSignal.reason?.name === "TimeoutError";
      if (isTimeout || (error instanceof Error && error.name === "TimeoutError")) {
        set({ loading: false, abortController: null, error: "Превышено время ожидания" });; 
      } 

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Запрос чеков отменен");
        } else {
          console.error("Сетевая ошибка при загрузке чеков:", error);
          set({ error: error.message, loading: false, abortController: null });
        }
      } else {
        set({
          error: "Произошла неизвестная ошибка", loading: false, abortController: null 
        });
      }
      
    }
  },
}));
