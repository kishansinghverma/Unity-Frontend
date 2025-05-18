import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { getMockCustomers } from '../services/mockData';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  country: string;
}

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [customers] = useState<Customer[]>(getMockCustomers());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'lastName',
    direction: 'asc',
  });

  const columns: ListColumn[] = [
    { id: 'name', label: 'Name', accessor: 'fullName', sortable: true },
    { id: 'email', label: 'Email', accessor: 'email', sortable: true },
    { id: 'company', label: 'Company', accessor: 'company', sortable: true },
    { id: 'status', label: 'Status', accessor: 'status', sortable: true },
    { id: 'country', label: 'Country', accessor: 'country', sortable: true },
  ];

  const handleSort = (field: string) => {
    setSortConfig((prevSortConfig) => ({
      field,
      direction:
        prevSortConfig.field === field && prevSortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const getSortedData = () => {
    const filteredData = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.firstName.toLowerCase().includes(searchLower) ||
        customer.lastName.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.company.toLowerCase().includes(searchLower)
      );
    });

    // Add full name for display
    const dataWithFullName = filteredData.map(customer => ({
      ...customer,
      fullName: `${customer.firstName} ${customer.lastName}`
    }));

    if (sortConfig.field) {
      dataWithFullName.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return dataWithFullName;
  };

  const handleRowClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your customer records
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/customers/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filter
          </Button>
          <Button
            variant="ghost"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        data={getSortedData()}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="No customers found. Try adjusting your search."
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">{customers.length}</span> results
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" disabled>
            Previous
          </Button>
          <Button variant="primary" size="sm">
            1
          </Button>
          <Button variant="ghost" size="sm">
            2
          </Button>
          <Button variant="ghost" size="sm">
            3
          </Button>
          <Button variant="ghost" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;