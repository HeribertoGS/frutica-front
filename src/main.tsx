import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WishlistProvider } from './contexts/WishlistContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </React.StrictMode>
);