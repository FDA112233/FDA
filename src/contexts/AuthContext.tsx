import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 检查本地存储中的登录状态
    const auth = localStorage.getItem("cyberguard_auth");
    const savedUser = localStorage.getItem("cyberguard_user");

    console.log("AuthContext初始化:", { auth, savedUser });

    if (auth === "true" && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
      console.log("用户已登录:", savedUser);
    } else {
      console.log("用户未登录");
    }

    setIsInitialized(true);
  }, []);

  const login = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
    localStorage.setItem("cyberguard_auth", "true");
    localStorage.setItem("cyberguard_user", username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("cyberguard_auth");
    localStorage.removeItem("cyberguard_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
