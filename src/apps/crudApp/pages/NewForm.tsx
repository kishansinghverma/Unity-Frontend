import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const NewForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sellerName: '',
    weight: '',
    packageCount: '',
    vehicleNumber: '',
    vehicleType: '',
    company: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Gate Pass</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new gate pass entry
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Seller Name"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              required
              placeholder="Enter seller name"
            />
            
            <Input
              label="Weight (in quintals)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              required
              placeholder="Enter weight"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Number of Packages"
              name="packageCount"
              type="number"
              value={formData.packageCount}
              onChange={handleChange}
              required
              placeholder="Enter package count"
            />
            
            <Input
              label="Vehicle Number"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              placeholder="Enter vehicle number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Vehicle Type"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              options={[
                { value: 'truck', label: 'Truck' },
                { value: 'tempo', label: 'Tempo' },
                { value: 'pickup', label: 'Pickup' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              options={[
                { value: 'company1', label: 'Company 1' },
                { value: 'company2', label: 'Company 2' },
                { value: 'company3', label: 'Company 3' },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Create Gate Pass
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewForm;