import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import AppContextProvider from "./context/AppContext.jsx";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AppContextProvider>
          <App />
          </AppContextProvider>
    </ClerkProvider>
      </BrowserRouter>
  </React.StrictMode>
);
