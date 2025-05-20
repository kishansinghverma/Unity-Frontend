import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';

const CustomerNew: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      // Normally you would save the data to your backend here
      navigate('/customers');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Customer</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new customer record in the system
        </p>
      </div>

      <CustomerForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CustomerNew;