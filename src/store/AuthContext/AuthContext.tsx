import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (username: string, password: string): boolean => {
    if (username === "eurisko@gmail.com" && password === "academy2025") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
