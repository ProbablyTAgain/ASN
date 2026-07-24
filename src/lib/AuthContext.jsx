import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

function getAuthRedirectUrl() {
  const configuredRedirect = import.meta.env.VITE_SUPABASE_REDIRECT_URL?.trim();
  if (configuredRedirect) {
    return configuredRedirect;
  }

  const { hostname, port } = window.location;
  const normalizedPort = port ? `:${port}` : "";

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `http://localhost${normalizedPort}/`;
  }

  return `${window.location.origin}${import.meta.env.BASE_URL || "/"}`;
}

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const navigateToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data?.session?.user) {
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthError(null);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = getAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    checkUserAuth();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
    });

    return () => data?.subscription?.unsubscribe();
  }, [checkUserAuth]);

  const value = {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    isAuthenticated,
    authChecked: !isLoadingAuth,
    user,
    navigateToLogin,
    checkUserAuth,
    logout,
    signInWithGoogle,
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
