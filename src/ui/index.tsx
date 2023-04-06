import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from './ThemeProvider';
import Chat from './Chat';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Chat />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);