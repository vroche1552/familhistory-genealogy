
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

// Use a try-catch block to handle potential React initialization errors
try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render React application:', error);
  // Display a fallback UI for critical errors
  const errorElement = document.createElement('div');
  errorElement.innerHTML = '<h1>Something went wrong</h1><p>Please try refreshing the page.</p>';
  document.body.appendChild(errorElement);
}
