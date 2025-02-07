import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import { AnimatePresence } from 'framer-motion';
import { MaterialUIControllerProvider } from '../src/context/index';
import './index.css';
const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <AnimatePresence mode="wait">
        <App />
      </AnimatePresence>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
