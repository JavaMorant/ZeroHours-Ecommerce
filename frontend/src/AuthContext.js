import React, { createContext, useState, useEffect, useContext } from 'react';
import httpClients from './httpClients.ts';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = localStorage.getItem('userToken');
      if (userToken) {
        try {
          const response = await httpClients.get("/check-login");
          setIsLoggedIn(response.data.isLoggedIn);
          if (!response.data.isLoggedIn) {
            localStorage.removeItem('userToken');
          }
        } catch (error) {
          console.error("Error checking login status:", error);
          localStorage.removeItem('userToken');
        }
      }
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem('userToken', token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await httpClients.post("/logout");
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);