// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Import CSS before any components
import './index.css';
// Import our cool theme CSS
import './styles/cool-theme.css';
// Import cool effects CSS
import './styles/cool-effects.css';
// Import dark table styles
import './styles/dark-table.css';

// Force stylesheet to be loaded first
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, ensuring styles are applied');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)