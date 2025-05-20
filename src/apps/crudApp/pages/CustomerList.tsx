import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  ButtonGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { useAppSelector } from '../../../hooks/useAppSelector';

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const { customers } = useAppSelector(state => state.customers);
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

  const handleRowClick = (customer: any) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <Box spacing="6">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ md: 'center' }}
        mb="6"
      >
        <Box mb={{ base: 4, md: 0 }}>
          <Text fontSize="2xl" fontWeight="bold">
            Customers
          </Text>
          <Text mt="1" fontSize="sm" color="gray.500">
            Manage your customer records
          </Text>
        </Box>
        <Button
          onClick={() => navigate('/customers/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Customer
        </Button>
      </Flex>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap="4"
        mb="6"
      >
        <Box flex={{ md: '1' }} maxW={{ md: '1/3' }}>
          <InputGroup>
            <InputLeftElement>
              <Search className="h-4 w-4 text-gray-400" />
            </InputLeftElement>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
            />
          </InputGroup>
        </Box>
        
        <ButtonGroup>
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
        </ButtonGroup>
      </Flex>

      <Table
        data={getSortedData()}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="No customers found. Try adjusting your search."
      />

      <Flex
        mt="4"
        align="center"
        justify="space-between"
        direction={{ base: 'column', sm: 'row' }}
        gap="4"
      >
        <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
          Showing <Text as="span" fontWeight="medium">1</Text> to{' '}
          <Text as="span" fontWeight="medium">10</Text> of{' '}
          <Text as="span" fontWeight="medium">{customers.length}</Text> results
        </Text>
        
        <ButtonGroup size="sm">
          <Button variant="ghost" isDisabled>
            Previous
          </Button>
          <Button variant="solid">1</Button>
          <Button variant="ghost">2</Button>
          <Button variant="ghost">3</Button>
          <Button variant="ghost">
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default CustomerList;