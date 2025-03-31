
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure the root element exists in the DOM
const rootElement = document.getElementById('root');
if (!rootElement) {
  // Create a root element if it doesn't exist
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

// Create root and render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
