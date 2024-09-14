// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import URL from '../component/UI/URL';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    const fetchUser = async () => {
      try {
      setLoading(true)
        const response = await fetch(`${URL()}/user/profile`, { credentials: "include" });
        if (response.ok) {
          const json = await response.json();
          setLoggedUser(json);
        } else {
          setLoggedUser(null);
        }
      }finally{
        setLoading(false)
      }
    }
    fetchUser();
  }, []);

  return !loading && (
    <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};
