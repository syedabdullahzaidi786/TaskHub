"use client";

/**
 * Authentication context
 * Provides auth state and methods throughout the app
 *
 * Note: Better Auth React SDK is not used as we implement custom
 * session-based authentication with HTTP-only cookies
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Wraps the app to provide authentication context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    setIsLoading(false);
  };

  const clearUser = () => {
    setUserState(null);
    setIsLoading(false);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Dynamically import to avoid circular dependency
        const { getSession } = await import("@/lib/api/auth");
        const user = await getSession();

        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        clearUser();
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    setUser,
    clearUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
