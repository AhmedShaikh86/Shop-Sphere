import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Holds the logged-in user and API token. Persisted to localStorage so a
 * page refresh doesn't log the user out; the axios client reads the token
 * directly from this store on every request.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      updateUser: (user) => set({ user }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    { name: "shopsphere-auth" }
  )
);
