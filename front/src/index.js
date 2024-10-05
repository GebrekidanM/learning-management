import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <BrowserRouter>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </BrowserRouter>
    </AuthProvider>
)