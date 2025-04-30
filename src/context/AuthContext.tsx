
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hardcoded credentials as requested
  const login = (username: string, password: string) => {
    if (username === "admin" && password === "123456") {
      setIsAuthenticated(true);
      toast.success("Login successful");
      return true;
    } else {
      toast.error("Invalid credentials");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
