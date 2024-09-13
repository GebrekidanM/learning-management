// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import URL from '../component/UI/URL';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${URL()}/user/profile`, { credentials: "include" });
      if (response.ok) {
        const json = await response.json();
        setLoggedUser(json);
      } else {
        setLoggedUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};
