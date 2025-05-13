import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminSession {
  id: string;
  email: string;
  name?: string;
  role: "admin";
  token: string;
}

interface AdminAuthState {
  adminSession: AdminSession | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (
    token: string,
    user: Omit<AdminSession, "token" | "role">
  ) => void;
  logoutAdmin: () => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminSession: null,
      isAdminAuthenticated: false,
      loginAdmin: (token, user) =>
        set({
          adminSession: { ...user, token, role: "admin" },
          isAdminAuthenticated: true,
        }),
      logoutAdmin: () =>
        set({
          adminSession: null,
          isAdminAuthenticated: false,
        }),
    }),
    {
      name: "admin-auth-store",
    }
  )
);

export default useAdminAuthStore;
