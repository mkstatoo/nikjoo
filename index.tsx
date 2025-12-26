import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill for process.env to prevent white screen on environments where it's not defined
// Added (window as any) cast to resolve the TypeScript error regarding the 'process' property on the window object.
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

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