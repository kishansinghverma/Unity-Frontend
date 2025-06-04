import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockCustomers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    status: 'active',
    country: 'us',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Globex Corp',
    status: 'active',
    country: 'ca',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Stark Industries',
    status: 'inactive',
    country: 'uk',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Wayne Enterprises',
    status: 'pending',
    country: 'au',
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 456-7890',
    company: 'LexCorp',
    status: 'active',
    country: 'us',
  },
];

export const getMockCustomers = () => {
  // Return copy of the data
  return [...mockCustomers];
};

export const getMockCustomerById = (id: string) => {
  return mockCustomers.find(customer => customer.id === id);
};

export const createMockCustomer = (customerData: any) => {
  const newCustomer = {
    id: uuidv4(),
    ...customerData,
  };
  
  // In a real app, you would add this to the database
  // mockCustomers.push(newCustomer);
  
  return newCustomer;
};

export const updateMockCustomer = (id: string, customerData: any) => {
  // In a real app, you would update the database
  const customerIndex = mockCustomers.findIndex(customer => customer.id === id);
  
  if (customerIndex !== -1) {
    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...customerData,
    };
    
    // mockCustomers[customerIndex] = updatedCustomer;
    return updatedCustomer;
  }
  
  return null;
};

export const deleteMockCustomer = (id: string) => {
  // In a real app, you would delete from the database
  const customerIndex = mockCustomers.findIndex(customer => customer.id === id);
  
  if (customerIndex !== -1) {
    // mockCustomers.splice(customerIndex, 1);
    return true;
  }
  
  return false;
};
