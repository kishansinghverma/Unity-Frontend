import { StyleProvider } from '@ant-design/cssinjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider layer>
        <App />
      </StyleProvider>
    </Provider>
  </React.StrictMode>,
);
