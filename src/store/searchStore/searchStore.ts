import { create } from "zustand";

interface SearchStore {
  query: string;
  setQuery: (text: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  setQuery: (text) => set({ query: text }),
}));
