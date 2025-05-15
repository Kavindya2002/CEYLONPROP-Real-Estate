import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthStatus, login, logout } from '../services/authService';
import { toast } from '../hooks/use-toast'; // Changed from @/ to relative path

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await checkAuthStatus();
        setUser(response.user);
        setIsAuthenticated(response.isAuthenticated);
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: `Welcome back, ${response.user.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}