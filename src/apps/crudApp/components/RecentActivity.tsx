import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { User, ShoppingCart, Clock, Package } from 'lucide-react';
import Card from '../../../components/ui/Card';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    icon: <User className="h-4 w-4 text-blue-600" />,
    title: 'New customer registered',
    description: 'Jane Smith created an account',
    time: '5 minutes ago',
  },
  {
    id: '2',
    icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
    title: 'New order placed',
    description: 'Order #38294 from Apple Inc.',
    time: '1 hour ago',
  },
  {
    id: '3',
    icon: <Package className="h-4 w-4 text-purple-600" />,
    title: 'Product updated',
    description: 'iPhone 13 Pro stock increased by 50',
    time: '3 hours ago',
  },
  {
    id: '4',
    icon: <ShoppingCart className="h-4 w-4 text-green-600" />,
    title: 'New order placed',
    description: 'Order #38293 from Microsoft Corp.',
    time: '5 hours ago',
  },
  {
    id: '5',
    icon: <Clock className="h-4 w-4 text-orange-600" />,
    title: 'Status update',
    description: 'Order #38288 changed to shipped',
    time: '1 day ago',
  },
];

const RecentActivity: React.FC = () => {
  const iconBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Card title="Recent Activity" className="h-full">
      <Box spacing="4">
        {mockActivities.map((activity) => (
          <Flex key={activity.id} align="start" mb={4} gap="3">
            <Box
              p="2"
              borderRadius="full"
              bg={iconBg}
              flexShrink={0}
            >
              {activity.icon}
            </Box>
            <Box flex="1" minW="0">
              <Text fontSize="sm" fontWeight="medium">
                {activity.title}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {activity.description}
              </Text>
            </Box>
            <Text fontSize="xs" color="gray.500" flexShrink={0}>
              {activity.time}
            </Text>
          </Flex>
        ))}
      </Box>
    </Card>
  );
};

export default RecentActivity;