// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust the import as necessary

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { loggedUser } = useContext(AuthContext);

  if (loggedUser) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
