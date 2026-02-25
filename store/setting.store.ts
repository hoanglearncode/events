import { General } from "@/app/(dashboard)/admin/settings/_types/setting";
import { defaultGeneralConfig } from "@/shared/config/site.config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth State Interface
interface SystemSetting {
  general: General | null;

  setGeneral: (general: General) => void;
  clearSetting: () => void;
}

// Create auth store with persistence
export const useSettingStore = create<SystemSetting>()(
  persist(
    (set, get) => ({
      // Initial state
      general: defaultGeneralConfig,

      // Actions
      setGeneral: (general) => {
        set((state) => ({
          ...state,
          general: general,
        }));
      },

      clearSetting: () => {
        set({
          general: defaultGeneralConfig,
        });
      },
    }),
    {
      name: "setting-storage", // Tên key trong localStorage
      partialize: (state) => ({
        // Chỉ persist những field cần thiết
        general: state.general,
      }),
      onRehydrateStorage: () => (state) => {},
    }
  )
);

// Selectors (for better performance and reusability)
export const settingSelectors = {
  general: (state: SystemSetting) => state.general,
  isHasGeneral: (state: SystemSetting) => !!state.general,
};

// Convenience hooks
export const useSetting = () => useSettingStore(settingSelectors.general);
