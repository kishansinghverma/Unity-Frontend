import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { useState } from 'react';
import { UserList } from './components/Users/UserList';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <Flex h="100vh">
            {isSidebarOpen && <Sidebar />}
            <Box flex="1" bg="gray.50">
              <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
              <Box p={8}>
                <UserList />
              </Box>
            </Box>
          </Flex>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;