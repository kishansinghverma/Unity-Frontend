import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import AppRoutes from './routes';
import { store } from './store/store';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#E6F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B8FF',
      400: '#33A0FF',
      500: '#0078D4',
      600: '#0064B0',
      700: '#004E8C',
      800: '#003968',
      900: '#002548',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AppRoutes />
      </ChakraProvider>
    </Provider>
  );
}

export default App;