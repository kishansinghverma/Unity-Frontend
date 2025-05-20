import React from 'react';
import { Box, Flex, Text, Button, ButtonGroup, useColorModeValue } from '@chakra-ui/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import Card from '../../../components/ui/Card';

const Dashboard: React.FC = () => {
  return (
    <Box spacing="6">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ sm: 'center' }}
        justify="space-between"
        mb="6"
      >
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Dashboard
          </Text>
          <Text mt="1" fontSize="sm" color="gray.500">
            Welcome back! Here's an overview of your business.
          </Text>
        </Box>
        <Box mt={{ base: 4, sm: 0 }}>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button>This Week</Button>
            <Button>This Month</Button>
            <Button>This Year</Button>
          </ButtonGroup>
        </Box>
      </Flex>

      <DashboardStats />

      <Box
        mt="6"
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gap="6"
      >
        <Card title="Revenue Overview">
          <Flex align="center" justify="space-between" mb="4">
            <Box>
              <Text fontSize="3xl" fontWeight="bold">
                $28,456
              </Text>
              <Flex align="center" color="green.600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <Text fontSize="sm">+14.5% from last month</Text>
              </Flex>
            </Box>
            <ButtonGroup size="xs" isAttached>
              <Button colorScheme="blue">Daily</Button>
              <Button>Weekly</Button>
              <Button>Monthly</Button>
            </ButtonGroup>
          </Flex>
          <Flex
            h="64"
            align="center"
            justify="center"
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="md"
          >
            <BarChart3 className="h-12 w-12 text-gray-400" />
            <Text ml="2" color="gray.500">
              Chart visualization goes here
            </Text>
          </Flex>
        </Card>

        <RecentActivity />
      </Box>
    </Box>
  );
};

export default Dashboard;