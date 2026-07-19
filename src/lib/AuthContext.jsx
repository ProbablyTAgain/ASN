import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const navigate = useNavigate();

  const navigateToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const checkUserAuth = useCallback(() => {
    setIsLoadingAuth(false);
    setIsAuthenticated(true);
    setAuthError(null);
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const value = {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    isAuthenticated,
    authChecked: !isLoadingAuth,
    navigateToLogin,
    checkUserAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
