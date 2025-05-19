import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Menu as MenuIcon, Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentApp } = useAppSelector(state => state.app);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      h="16"
      px="4"
      bg={bg}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <Flex h="full" align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open menu"
            icon={<MenuIcon />}
            size="md"
            variant="ghost"
            mr="4"
          />
          
          <Text
            display={{ base: 'none', md: 'block' }}
            fontSize="xl"
            fontWeight="semibold"
          >
            {currentApp?.name}
          </Text>
        </Flex>
        
        <Flex align="center" gap="3">
          <InputGroup display={{ base: 'none', md: 'block' }} w="64">
            <InputLeftElement>
              <Search className="w-4 h-4 text-gray-500" />
            </InputLeftElement>
            <Input placeholder="Search..." />
          </InputGroup>
          
          <IconButton
            aria-label="Notifications"
            icon={<Bell className="w-5 h-5" />}
            variant="ghost"
            rounded="full"
          />
          
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              display="flex"
              alignItems="center"
              px="2"
              rounded="full"
            >
              <Flex align="center" gap="2">
                <Avatar
                  size="sm"
                  icon={<User className="w-4 h-4" />}
                  bg="blue.500"
                  color="white"
                />
                <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                  <Text fontSize="sm" fontWeight="medium">John Doe</Text>
                  <Text fontSize="xs" color="gray.500">Administrator</Text>
                </Box>
                <ChevronDown className="w-4 h-4" />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;