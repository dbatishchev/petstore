import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './app/components/App/App.tsx';
import { getDesignTokens, getThemedComponents } from './app/brandingTheme.ts';
import merge from 'lodash/merge';

const globalStyles = css`
  :root {
    color-scheme: dark;
  }
`;

const designTokens = getDesignTokens('dark');
let newTheme = createTheme(designTokens);
newTheme = merge(newTheme, getThemedComponents(newTheme));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={newTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
