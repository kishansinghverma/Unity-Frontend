import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import CustomerForm from '../components/CustomerForm';
import { useAppDispatch } from '../../../hooks/useAppSelector';
import { addCustomer } from '../../../store/slices/customerSlice';

const CustomerNew: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      dispatch(addCustomer(data));
      setIsLoading(false);
      navigate('/customers');
    }, 1000);
  };

  return (
    <Box spacing="6">
      <Box mb="6">
        <Text fontSize="2xl" fontWeight="bold">
          Add New Customer
        </Text>
        <Text mt="1" fontSize="sm" color="gray.500">
          Create a new customer record in the system
        </Text>
      </Box>

      <CustomerForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default CustomerNew;