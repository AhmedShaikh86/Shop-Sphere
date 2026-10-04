import { create } from "zustand";

/**
 * Lightweight client-only UI state: things no page needs to fetch or
 * persist, like whether the cart drawer or search overlay is open.
 */
export const useUiStore = create((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileNavOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}));
