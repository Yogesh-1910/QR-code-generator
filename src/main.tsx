import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QRCodesProvider } from './context/QRCodesContext.tsx'; // Import the provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QRCodesProvider> {/* Wrap the App */}
      <App />
    </QRCodesProvider>
  </StrictMode>
);