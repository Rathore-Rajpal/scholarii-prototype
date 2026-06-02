import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role, User } from "./types";

const KEY = "scholarii-user-v1";
const THEME_KEY = "scholarii-theme";
const PARENT_MODE_KEY = "scholarii-parent-mode";

export const DEMO_USERS: Record<Role, { email: string; name: string; color: string }> = {
  principal: { email: "principal@school.com", name: "Dr. Asha Verma", color: "#667eea" },
  teacher: { email: "teacher@school.com", name: "Rajesh Kumar", color: "#764ba2" },
  student: { email: "student@school.com", name: "Aarav Sharma", color: "#10b981" },
  admin: { email: "admin@school.com", name: "Priya Mehta", color: "#f59e0b" },
};

const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || "";

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string };
  logout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  parentMode: boolean;
  setParentMode: (v: boolean) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const safeLocalStorageGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read localStorage key ${key}`, error);
    return null;
  }
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to write localStorage key ${key}`, error);
  }
};

const safeLocalStorageRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key ${key}`, error);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [parentMode, setParentModeState] = useState(false);

  useEffect(() => {
    try {
      const raw = safeLocalStorageGet(KEY);
      if (raw) setUser(JSON.parse(raw));
      const t = (safeLocalStorageGet(THEME_KEY) as "light" | "dark") || "light";
      setTheme(t);
      document.documentElement.classList.toggle("dark", t === "dark");
      setParentModeState(safeLocalStorageGet(PARENT_MODE_KEY) === "1");
    } catch (error) {
      console.error("Failed to initialize auth state", error);
    }
  }, []);

  const login: AuthCtx["login"] = (email, password, role) => {
    const demo = DEMO_USERS[role];
    if (!demo) return { ok: false, error: "Invalid role" };
    if (!DEMO_PASSWORD) {
      return { ok: false, error: "Demo mode not configured" };
    }
    if (email.trim().toLowerCase() !== demo.email || password !== DEMO_PASSWORD) {
      return { ok: false, error: "Invalid credentials. Use the demo credentials shown." };
    }
    const u: User = { email: demo.email, name: demo.name, role, avatarColor: demo.color };
    safeLocalStorageSet(KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const logout = () => {
    safeLocalStorageRemove(KEY);
    safeLocalStorageRemove(PARENT_MODE_KEY);
    setParentModeState(false);
    setUser(null);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    safeLocalStorageSet(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const setParentMode = (v: boolean) => {
    setParentModeState(v);
    safeLocalStorageSet(PARENT_MODE_KEY, v ? "1" : "0");
  };

  return (
    <Ctx.Provider value={{ user, login, logout, theme, toggleTheme, parentMode, setParentMode }}>
      {children}
    </Ctx.Provider>
  );
}

// ✅ CHANGED: SSR-safe fallback instead of throwing error
export function useAuth() {
  const c = useContext(Ctx);
  if (!c) {
    return {
      user: null,
      login: () => ({ ok: false, error: "Not ready" }),
      logout: () => {},
      theme: "light" as const,
      toggleTheme: () => {},
      parentMode: false,
      setParentMode: () => {},
    };
  }
  return c;
}