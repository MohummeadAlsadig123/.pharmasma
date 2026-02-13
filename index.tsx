
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// In a Desktop-Only app, we rely on the Electron environment
// Service workers are removed to prioritize native resource loading

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
