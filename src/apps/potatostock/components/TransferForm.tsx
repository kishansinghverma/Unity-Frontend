import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { mockStocks } from '../services/mockData';
import type { Stock, StockTransfer } from '../types';

interface TransferFormProps {
  onSubmit: (data: Omit<StockTransfer, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    sourceStockId: '',
    quantity: 0,
    destinationStorage: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState<{
    sourceStockId?: string;
    quantity?: string;
    destinationStorage?: string;
    date?: string;
  }>({});

  const selectedStock = mockStocks.find(s => s.id === formData.sourceStockId);

  const handleStockSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stockId = e.target.value;
    setFormData({
      ...formData,
      sourceStockId: stockId,
      quantity: 0
    });
    setErrors({ ...errors, sourceStockId: undefined });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      if (selectedStock && value > selectedStock.quantity) {
        setErrors({
          ...errors,
          quantity: `Cannot transfer more than available quantity (${selectedStock.quantity} ${selectedStock.unit})`
        });
      } else {
        setFormData({ ...formData, quantity: value });
        setErrors({ ...errors, quantity: undefined });
      }
    } else {
      setErrors({ ...errors, quantity: 'Please enter a valid quantity' });
    }
  };

  const handleStorageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storage = e.target.value;
    if (storage === selectedStock?.storage) {
      setErrors({
        ...errors,
        destinationStorage: 'Destination storage must be different from current storage'
      });
    } else {
      setFormData({ ...formData, destinationStorage: storage });
      setErrors({ ...errors, destinationStorage: undefined });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
    setErrors({ ...errors, date: undefined });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.sourceStockId) {
      newErrors.sourceStockId = 'Please select a stock to transfer';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (selectedStock && formData.quantity > selectedStock.quantity) {
      newErrors.quantity = `Cannot transfer more than available quantity (${selectedStock.quantity} ${selectedStock.unit})`;
    }

    if (!formData.destinationStorage) {
      newErrors.destinationStorage = 'Please select a destination storage';
    } else if (selectedStock && formData.destinationStorage === selectedStock.storage) {
      newErrors.destinationStorage = 'Destination storage must be different from current storage';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a transfer date';
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

  // Get unique storage locations from mockStocks
  const storageLocations = Array.from(new Set(mockStocks.map(stock => stock.storage)));

  const stockOptions = mockStocks.map(stock => ({
    value: stock.id,
    label: `${stock.variety} - ${stock.storage} (${stock.quantity} ${stock.unit})`
  }));

  const storageOptions = storageLocations
    .filter(storage => storage !== selectedStock?.storage)
    .map(storage => ({
      value: storage,
      label: storage
    }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Source Stock"
          value={formData.sourceStockId}
          onChange={handleStockSelect}
          error={errors.sourceStockId}
          options={stockOptions}
          required
        />

        {selectedStock && (
          <>
            <Input
              type="number"
              label="Transfer Quantity"
              value={formData.quantity}
              onChange={handleQuantityChange}
              min={1}
              max={selectedStock.quantity}
              error={errors.quantity}
              helperText={`Available: ${selectedStock.quantity} ${selectedStock.unit}`}
              required
            />

            <Select
              label="Destination Storage"
              value={formData.destinationStorage}
              onChange={handleStorageChange}
              error={errors.destinationStorage}
              options={storageOptions}
              required
            />
          </>
        )}

        <Input
          type="date"
          label="Transfer Date"
          value={formData.date}
          onChange={handleDateChange}
          error={errors.date}
          required
        />

        <Input
          type="text"
          label="Notes"
          placeholder="Add transfer notes (optional)"
          value={formData.notes}
          onChange={handleNotesChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit Transfer
        </Button>
      </div>
    </form>
  );
};

export default TransferForm;
