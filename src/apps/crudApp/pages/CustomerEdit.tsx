import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';
import { getMockCustomerById } from '../services/mockData';

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API fetch
      setTimeout(() => {
        const fetchedCustomer = getMockCustomerById(id);
        setCustomer(fetchedCustomer);
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

  const handleSubmit = (data: any) => {
    setIsSaving(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSaving(false);
      // Normally you would update the data to your backend here
      navigate(`/customers/${id}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer not found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">The customer you're trying to edit doesn't exist or has been removed.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/customers')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update customer information
        </p>
      </div>

      <CustomerForm
        isEditing={true}
        initialData={customer}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
};

export default CustomerEdit;