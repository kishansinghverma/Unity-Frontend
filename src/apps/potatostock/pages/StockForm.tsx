import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { StockFormData } from '../types';
import { mockStocks } from '../services/mockData';

const QUALITIES = ['Premium', 'Standard', 'Economy'];
const WAREHOUSES = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
const VARIETIES = ['Red Potato', 'White Potato', 'Baby Potato', 'Russet Potato'];

const StockForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<StockFormData>>({});

  const [formData, setFormData] = useState<StockFormData>({
    variety: '',
    quantity: 0,
    unit: 'kg',
    price: 0,
    storage: '',
    dateReceived: new Date().toISOString().split('T')[0],
    quality: '',
    supplier: '',
    status: 'In Stock'
  });

  useEffect(() => {
    if (id) {
      const stock = mockStocks.find(s => s.id === id);
      if (stock) {
        setFormData({
          variety: stock.variety,
          quantity: stock.quantity,
          unit: stock.unit,
          price: stock.price,
          storage: stock.storage,
          dateReceived: stock.dateReceived,
          quality: stock.quality,
          supplier: stock.supplier,
          status: stock.status
        });
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<StockFormData> = {};
    
    if (!formData.variety) {
      newErrors.variety = 'Variety is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.storage) {
      newErrors.storage = 'Storage location is required';
    }
    
    if (!formData.quality) {
      newErrors.quality = 'Quality grade is required';
    }
    
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would handle the form submission
      console.log('Form submitted:', formData);
      navigate('/potatostock/stock');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {id ? 'Edit Stock Entry' : 'Add New Stock'}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/potatostock/stock')}
                leftIcon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="variety" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Variety <span className="text-red-500">*</span>
              </label>
              <Select
                id="variety"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                options={VARIETIES}
                error={errors.variety}
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity (kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                required
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Price (₹/kg) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="storage" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Storage Location <span className="text-red-500">*</span>
              </label>
              <Select
                id="storage"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                options={WAREHOUSES}
                error={errors.storage}
                required
              />
            </div>

            <div>
              <label htmlFor="quality" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quality Grade <span className="text-red-500">*</span>
              </label>
              <Select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                options={QUALITIES}
                error={errors.quality}
                required
              />
            </div>

            <div>
              <label htmlFor="supplier" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Supplier <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                error={errors.supplier}
                required
              />
            </div>

            <div>
              <label htmlFor="dateReceived" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Received <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                id="dateReceived"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={['In Stock', 'Low Stock', 'Out of Stock']}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StockForm;
