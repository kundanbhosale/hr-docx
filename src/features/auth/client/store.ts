import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  email?: string;
  emailSent?: Date | string;
  callback?: string;
};
type Actions = {
  update: (data: Partial<AuthStore>) => void;
};

export const useAuthStore = create(
  persist<AuthStore & Actions>(
    (set) => ({
      email: undefined,
      callback: undefined,
      update: (data) => set((prev) => ({ ...prev, ...data })),
    }),
    {
      name: "mhr-auth-store", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
