import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Performance monitoring
const startTime = performance.now();

// Error handling for the root
const handleError = (error) => {
  console.error('Unhandled error in app:', error);
  // In production, you might want to send this to an error reporting service
};

// Create root with error handling
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

// Render with error boundary
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Performance logging
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
});

// Global error handler
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
