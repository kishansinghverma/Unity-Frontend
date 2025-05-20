import { Box, Flex, Text, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Bell, Menu as MenuIcon } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <Box bg="white" px={6} py={4} borderBottom="1px" borderColor="gray.200">
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <IconButton
            icon={<MenuIcon />}
            variant="ghost"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            mr={4}
          />
          <Text fontSize="xl" fontWeight="bold">
            Admin Dashboard
          </Text>
        </Flex>

        <Flex align="center">
          <IconButton
            icon={<Bell />}
            variant="ghost"
            aria-label="Notifications"
            mr={4}
          />
          <Menu>
            <MenuButton>
              <Avatar size="sm" name="User Name" src="https://bit.ly/broken-link" />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};