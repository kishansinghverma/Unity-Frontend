import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react';
import { Save, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

interface CustomerFormProps {
  isEditing?: boolean;
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  isEditing = false,
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    status: initialData.status || '',
    country: initialData.country || '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card
      title={isEditing ? 'Edit Customer' : 'Add New Customer'}
      description={isEditing ? 'Update customer information' : 'Create a new customer record'}
    >
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
            placeholder="John"
          />
          
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
            placeholder="Doe"
          />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
            placeholder="john.doe@example.com"
          />
          
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Inc."
          />
          
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            error={errors.status}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Select
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            options={[
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'au', label: 'Australia' },
            ]}
          />
        </SimpleGrid>
        
        <SimpleGrid columns={2} spacing={3} justifyContent="end">
          <Button
            variant="ghost"
            onClick={() => navigate('/customers')}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditing ? 'Update Customer' : 'Create Customer'}
          </Button>
        </SimpleGrid>
      </form>
    </Card>
  );
};

export default CustomerForm;