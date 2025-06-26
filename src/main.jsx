// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import '@fontsource/poppins';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ✅ Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: {
       main: '#0D1B2A', 
      contrastText: '#fff',
    },
    secondary: {
      main: '#1B263B',
      contrastText: '#fff',
    },
    background: {
      default: '#E0E1DD',
      paper: '#ffffff',
    },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('❌ Root element not found. Make sure <div id="root"></div> exists in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
