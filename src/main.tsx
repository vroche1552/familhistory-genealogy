
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root element if it doesn't exist
const rootElement = document.getElementById('root') || (() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  return root;
})();

// Initialize React immediately
const root = ReactDOM.createRoot(rootElement);

// Render the application
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render React application:', error);
  const errorElement = document.createElement('div');
  errorElement.innerHTML = '<h1>Something went wrong</h1><p>Please try refreshing the page.</p>';
  document.body.appendChild(errorElement);
}

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
