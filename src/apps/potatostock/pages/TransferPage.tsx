import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransferForm from '../components/TransferForm';
import type { StockTransfer } from '../types';
import Card from '../../../components/ui/Card';

const TransferPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Omit<StockTransfer, 'id' | 'status'>) => {
    // TODO: Implement actual transfer submission
    console.log('Transfer data:', data);
    navigate('/potatostock/inventory');
  };

  const handleCancel = () => {
    navigate('/potatostock/inventory');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Transfer Stock</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <TransferForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default TransferPage;
