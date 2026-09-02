import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { CMSProvider } from './context/CMSContext.tsx';
import '@fontsource/krona-one';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CMSProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </CMSProvider>
  </StrictMode>,
);
