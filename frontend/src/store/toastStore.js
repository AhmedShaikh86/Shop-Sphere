import { create } from "zustand";

let nextId = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, variant = "success") =>
    set((state) => {
      const id = nextId++;

      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, 4000);

      return { toasts: [...state.toasts, { id, message, variant }] };
    }),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
