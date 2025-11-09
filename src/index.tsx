
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './services/errorHunter'; // Initialize global error handlers
import { initSentry } from './services/sentryService';
import './index.css';

// Initialize Sentry for error reporting
initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
