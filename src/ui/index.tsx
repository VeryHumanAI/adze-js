import dotenv from "dotenv";
import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from './ThemeProvider';

dotenv.config();

import('./Chat').then(ChatModule => {
  const Chat = ChatModule.default;
  
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider>
        <Chat />
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
