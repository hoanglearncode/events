import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

// Auth State Interface
interface AuthState {
  // State
  user: User | null;

  // Actions
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,

      // Actions
      setUser: (user) => {
        set((state) => ({
          ...state,
          user,
        }));
      },

      clearAuth: () => {
        set({
          user: null,
        });
      },
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
      partialize: (state) => ({
        // Chỉ persist những field cần thiết
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {},
    }
  )
);

// Selectors (for better performance and reusability)
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isHasUser: (state: AuthState) => !!state.user,
};

// Convenience hooks
export const useAuthUser = () => useAuthStore(authSelectors.user);
