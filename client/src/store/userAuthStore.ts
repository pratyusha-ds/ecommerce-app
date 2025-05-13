import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: "user";
  token: string;
}

interface UserAuthState {
  userSession: UserSession | null;
  isUserAuthenticated: boolean;
  loginUser: (token: string, user: Omit<UserSession, "token" | "role">) => void;
  logoutUser: () => void;
}

const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      userSession: null,
      isUserAuthenticated: false,
      loginUser: (token, user) =>
        set({
          userSession: { ...user, token, role: "user" },
          isUserAuthenticated: true,
        }),
      logoutUser: () =>
        set({
          userSession: null,
          isUserAuthenticated: false,
        }),
    }),
    {
      name: "user-auth-store",
    }
  )
);

export default useUserAuthStore;
