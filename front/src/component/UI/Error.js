import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { errorCode, errorMessage } = location.state || { errorCode: '500', errorMessage: 'Something went wrong.' };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{errorCode}</h1>
      <p style={styles.message}>{errorMessage}</p>
      <button style={styles.button} onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  message: {
    fontSize: '24px',
    color: '#6c757d',
  },
  button: {
    marginTop: '24px',
    padding: '12px 24px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default Error;
