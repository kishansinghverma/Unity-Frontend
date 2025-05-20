import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { Users, ShoppingCart, Package, DollarSign } from 'lucide-react';
import Card from '../../../components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, positive = true }) => {
  const iconBg = useColorModeValue('blue.100', 'blue.900');
  const changeColor = positive ? 'green.600' : 'red.600';
  const changeColorDark = positive ? 'green.400' : 'red.400';

  return (
    <Card>
      <Flex align="center">
        <Box
          mr="4"
          p="3"
          borderRadius="full"
          bg={iconBg}
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            {value}
          </Text>
          <Text
            fontSize="xs"
            color={useColorModeValue(changeColor, changeColorDark)}
          >
            {change}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      gap="6"
    >
      <StatCard
        title="Customers"
        value="1,284"
        change="+12% from last month"
        icon={<Users className="h-6 w-6 text-blue-600" />}
        positive={true}
      />
      <StatCard
        title="Orders"
        value="843"
        change="+8% from last month"
        icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
        positive={true}
      />
      <StatCard
        title="Products"
        value="524"
        change="-3% from last month"
        icon={<Package className="h-6 w-6 text-blue-600" />}
        positive={false}
      />
      <StatCard
        title="Revenue"
        value="$94,256"
        change="+18% from last month"
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        positive={true}
      />
    </Box>
  );
};

export default DashboardStats;