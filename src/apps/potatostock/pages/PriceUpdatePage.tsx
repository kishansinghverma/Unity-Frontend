import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriceUpdateForm from '../components/PriceUpdateForm';
import type { StockPriceUpdate } from '../types';
import Card from '../../../components/ui/Card';

const PriceUpdatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Omit<StockPriceUpdate, 'id'>) => {
    // TODO: Implement actual price update submission
    console.log('Price update data:', data);
    navigate('/potatostock/inventory');
  };

  const handleCancel = () => {
    navigate('/potatostock/inventory');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Update Stock Price</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <PriceUpdateForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default PriceUpdatePage;
