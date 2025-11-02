// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './App'; // Import the main component we created

// Find the root element in public/index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
