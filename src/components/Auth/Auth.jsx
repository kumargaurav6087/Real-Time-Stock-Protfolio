"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // ✅ Run only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeToken = localStorage.getItem("token");
      if (storeToken) {
        setToken(storeToken);
      }
    }
  }, []);

  const storetokeninLS = (serverToken) => {
    setToken(serverToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", serverToken);
    }
  };

  const LogoutUser = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  let isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storetokeninLS, LogoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);
  if (!AuthContextValue) {
    throw new Error("useAuth used outside of the provider");
  }
  return AuthContextValue;
};
