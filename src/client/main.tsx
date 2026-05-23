import { ThemeProvider, CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { App } from './App.js';
import { theme } from './theme/theme.js';
import { TrpcProvider } from './trpc.js';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('No #root element');

createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TrpcProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </TrpcProvider>
    </ThemeProvider>
  </StrictMode>,
);
