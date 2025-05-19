import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppSelector } from '../../hooks/useAppSelector';

const AppShell: React.FC = () => {
  const { currentApp } = useAppSelector(state => state.app);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const bg = useColorModeValue('gray.50', 'gray.900');

  if (!currentApp) {
    return <Box>Loading...</Box>;
  }

  return (
    <Flex h="100vh" bg={bg}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <Flex direction="column" flex="1" overflow="hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <Box as="main" flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AppShell;