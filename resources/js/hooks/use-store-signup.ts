import { RegisterSchema } from "@/lib/validations/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type OnboardingState = Partial<RegisterSchema> & {
  setData: (data: Partial<RegisterSchema>) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setData: (data) => set(data),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);