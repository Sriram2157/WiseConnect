import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface UserState {
  id: string | null;
  name: string;
  quizCompleted: boolean;
  digitalLiteracyLevel: string | null;
  learningStyle: string | null;
}

interface UserContextType {
  user: UserState;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
  isLoggedIn: boolean;
}

const defaultUser: UserState = {
  id: null,
  name: "",
  quizCompleted: false,
  digitalLiteracyLevel: null,
  learningStyle: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wiseconnect-user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultUser;
        }
      }
    }
    return defaultUser;
  });

  useEffect(() => {
    localStorage.setItem("wiseconnect-user", JSON.stringify(user));
  }, [user]);

  const setUser = (updates: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updates }));
  };

  const clearUser = () => {
    setUserState(defaultUser);
    localStorage.removeItem("wiseconnect-user");
  };

  const isLoggedIn = user.id !== null && user.name !== "";

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
