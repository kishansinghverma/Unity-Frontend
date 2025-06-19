import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { mockStocks } from '../services/mockData';
import type { StockPriceUpdate } from '../types';

interface PriceUpdateFormProps {
  onSubmit: (data: Omit<StockPriceUpdate, 'id'>) => void;
  onCancel: () => void;
}

const PriceUpdateForm: React.FC<PriceUpdateFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    stockId: '',
    oldPrice: 0,
    newPrice: 0,
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [errors, setErrors] = useState<{
    stockId?: string;
    newPrice?: string;
    date?: string;
    reason?: string;
  }>({});

  const selectedStock = mockStocks.find(s => s.id === formData.stockId);

  const handleStockSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stockId = e.target.value;
    const stock = mockStocks.find(s => s.id === stockId);
    if (stock) {
      setFormData({
        ...formData,
        stockId,
        oldPrice: stock.price,
        newPrice: stock.price
      });
      setErrors({});
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData({ ...formData, newPrice: value });
      setErrors({ ...errors, newPrice: undefined });
    } else {
      setErrors({ ...errors, newPrice: 'Please enter a valid price' });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
    setErrors({ ...errors, date: undefined });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, reason: e.target.value });
    setErrors({ ...errors, reason: undefined });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.stockId) {
      newErrors.stockId = 'Please select a stock';
    }

    if (formData.newPrice <= 0) {
      newErrors.newPrice = 'Price must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (formData.newPrice === formData.oldPrice) {
      newErrors.newPrice = 'New price must be different from current price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const stockOptions = mockStocks.map(stock => ({
    value: stock.id,
    label: `${stock.variety} - Current Price: ₹${stock.price}/${stock.unit}`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Select Stock"
          value={formData.stockId}
          onChange={handleStockSelect}
          error={errors.stockId}
          options={stockOptions}
          required
        />

        {selectedStock && (
          <>
            <Input
              type="number"
              label="Current Price"
              value={formData.oldPrice}
              disabled
            />

            <Input
              type="number"
              label="New Price"
              value={formData.newPrice}
              onChange={handlePriceChange}
              min={0}
              step={0.5}
              error={errors.newPrice}
              placeholder={`Enter new price (current: ₹${formData.oldPrice})`}
              required
            />
          </>
        )}

        <Input
          type="date"
          label="Update Date"
          value={formData.date}
          onChange={handleDateChange}
          error={errors.date}
          required
        />

        <Input
          type="text"
          label="Reason"
          placeholder="Reason for price update..."
          value={formData.reason}
          onChange={handleReasonChange}
          error={errors.reason}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update Price
        </Button>
      </div>
    </form>
  );
};

export default PriceUpdateForm;
