import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import {
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  BarChart3,
  User,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppSelector';
import { setCurrentApp } from '../../store/slices/appSlice';
import { APPS } from '../../constants/apps';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentApp } = useAppSelector(state => state.app);
  const [showAppMenu, setShowAppMenu] = useState(false);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navHoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'gray.700');
  const activeColor = useColorModeValue('blue.600', 'blue.400');

  const handleAppChange = (appId: string) => {
    const app = APPS.find(a => a.id === appId);
    if (app) {
      dispatch(setCurrentApp(app));
      setShowAppMenu(false);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'LayoutDashboard': return <LayoutDashboard />;
      case 'BarChart3': return <BarChart3 />;
      default: return <LayoutDashboard />;
    }
  };

  const getNavItems = () => {
    if (currentApp?.id === 'crud-app') {
      return [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
        { name: 'New', path: '/new', icon: <PlusCircle /> },
        { name: 'Customers', path: '/customers', icon: <Users /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart /> },
        { name: 'Products', path: '/products', icon: <Package /> },
        { name: 'Settings', path: '/settings', icon: <Settings /> },
      ];
    } else {
      return [
        { name: 'Overview', path: '/analytics', icon: <BarChart3 /> },
        { name: 'Reports', path: '/reports', icon: <BarChart3 /> },
        { name: 'Settings', path: '/analytics-settings', icon: <Settings /> },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <Box
      position={{ base: 'fixed', lg: 'static' }}
      left="0"
      top="0"
      h="100vh"
      w={{ base: '64', lg: '72' }}
      bg={bg}
      borderRightWidth="1px"
      borderColor={borderColor}
      transform={{
        base: open ? 'translateX(0)' : 'translateX(-100%)',
        lg: 'translateX(0)',
      }}
      transition="transform 0.2s"
      zIndex="20"
    >
      <Flex direction="column" h="full">
        <Flex
          p="4"
          justify="space-between"
          align="center"
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Menu isOpen={showAppMenu} onClose={() => setShowAppMenu(false)}>
            <MenuButton
              as={Button}
              variant="ghost"
              onClick={() => setShowAppMenu(!showAppMenu)}
              display="flex"
              alignItems="center"
              w="full"
              justifyContent="start"
            >
              <Flex align="center" gap="2">
                <Box
                  bg="blue.600"
                  w="8"
                  h="8"
                  rounded="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    D
                  </Text>
                </Box>
                <Text fontSize="xl" fontWeight="semibold">
                  D365 UI
                </Text>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showAppMenu ? 'rotate-180' : ''
                  }`}
                />
              </Flex>
            </MenuButton>
            <MenuList>
              {APPS.map((app) => (
                <MenuItem
                  key={app.id}
                  onClick={() => handleAppChange(app.id)}
                  bg={currentApp?.id === app.id ? activeBg : 'transparent'}
                  color={currentApp?.id === app.id ? activeColor : 'inherit'}
                >
                  <Flex align="center" gap="3">
                    {getIcon(app.icon)}
                    <Text>{app.name}</Text>
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            icon={<X />}
            size="sm"
            variant="ghost"
          />
        </Flex>

        <Box flex="1" overflowY="auto" px="4" py="3">
          <Text
            textTransform="uppercase"
            fontSize="xs"
            fontWeight="semibold"
            color="gray.500"
            mb="2"
          >
            Navigation
          </Text>
          <VStack spacing="1" align="stretch">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  w="full"
                  justifyContent="start"
                  px="3"
                  py="2"
                  bg={location.pathname === item.path ? activeBg : 'transparent'}
                  color={location.pathname === item.path ? activeColor : 'inherit'}
                  _hover={{ bg: navHoverBg }}
                  leftIcon={item.icon}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </VStack>
        </Box>

        <Box p="4" borderTopWidth="1px" borderColor={borderColor}>
          <Flex align="center" gap="3">
            <Avatar
              size="md"
              icon={<User />}
              bg="blue.500"
              color="white"
            />
            <Box>
              <Text fontSize="sm" fontWeight="medium">
                John Doe
              </Text>
              <Text fontSize="xs" color="gray.500">
                Administrator
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;