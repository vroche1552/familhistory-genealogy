
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make React available globally to ensure components using hooks work properly
window.React = React;

// Create root element if it doesn't exist
const rootElement = document.getElementById('root') || (() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  return root;
})();

// Initialize React
const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);
