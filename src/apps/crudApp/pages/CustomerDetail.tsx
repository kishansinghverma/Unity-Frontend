import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { getMockCustomerById } from '../services/mockData';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer not found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">The customer you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Button onClick={() => navigate('/customers')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/customers')}
              className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.firstName} {customer.lastName}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customer details and information
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="ghost"
            leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
            className="border border-gray-300 dark:border-gray-600"
          >
            Delete
          </Button>
          <Button
            onClick={() => navigate(`/customers/edit/${customer.id}`)}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Customer Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.phone || '-'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{customer.company || '-'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : customer.status === 'inactive'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {customer.country === 'us'
                    ? 'United States'
                    : customer.country === 'ca'
                    ? 'Canada'
                    : customer.country === 'uk'
                    ? 'United Kingdom'
                    : customer.country === 'au'
                    ? 'Australia'
                    : customer.country || '-'}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Orders">
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-gray-500 dark:text-gray-400">No orders found for this customer</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Activity">
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Profile updated
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    2 days ago
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900">
                    <Trash2 className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer created
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    1 week ago
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Notes">
            <div className="space-y-4">
              <textarea
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a note about this customer..."
              ></textarea>
              <div className="flex justify-end">
                <Button size="sm">Save Note</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;