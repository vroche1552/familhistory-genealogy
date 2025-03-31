
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wait for the DOM to be fully loaded before initializing React
document.addEventListener('DOMContentLoaded', () => {
  // Make sure the root element exists in the DOM
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    // Create a root element if it doesn't exist
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  // Use a try-catch block to handle potential React initialization errors
  try {
    const root = ReactDOM.createRoot(rootElement);
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
});

// Add a global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the blank screen if React fails to initialize properly
  if (document.body.children.length === 0 || 
      (document.getElementById('root') && document.getElementById('root').children.length === 0)) {
    const errorElement = document.createElement('div');
    errorElement.innerHTML = '<h1>Something went wrong</h1><p>Please try refreshing the page.</p>';
    document.body.appendChild(errorElement);
  }
});
