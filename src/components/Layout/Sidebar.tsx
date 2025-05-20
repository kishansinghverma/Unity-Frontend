import { Box, VStack, Text, Icon } from '@chakra-ui/react';
import { Users, Home, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <Box
      bg="white"
      w="250px"
      h="100vh"
      py={8}
      px={4}
      borderRight="1px"
      borderColor="gray.200"
    >
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Box
              display="flex"
              alignItems="center"
              p={3}
              borderRadius="md"
              bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
              color={location.pathname === item.path ? 'blue.500' : 'gray.600'}
              _hover={{ bg: 'blue.50', color: 'blue.500' }}
            >
              <Icon as={item.icon} mr={3} />
              <Text fontWeight="medium">{item.label}</Text>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};