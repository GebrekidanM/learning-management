// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import URL from '../component/UI/URL';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
 
  const checkAuth = async () => {
    try {
      const response = await fetch(`${URL()}/user/profile`, {
        method: 'GET',
        credentials: 'include', 
      });

      if (response.ok) {
        const userData = await response.json();
        setLoggedUser(userData);
      } else {
        setLoggedUser(null);
      }
    } catch (error) {
      console.log("Authentication check failed", error);
      setLoggedUser(null); 
    }
  };

  useEffect(() => {
    checkAuth()
  }, []);

  return (
    <AuthContext.Provider value={{ loggedUser, setLoggedUser,checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
