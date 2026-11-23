import { create } from "zustand";

interface ReceiptsUIState {
  page: number;
  setPage: (newPage: number) => void;
}

export const useReceiptsStore = create<ReceiptsUIState>((set) => ({
  page: 1,
  setPage: (newPage) => set({ page: newPage }),
}));
