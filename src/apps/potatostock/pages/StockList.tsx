import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { mockStocks } from '../services/mockData';
import { Stock } from '../types';

const StockList: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'dateReceived',
    direction: 'desc',
  });

  const columns: ListColumn[] = [
    { id: 'variety', label: 'Variety', accessor: 'variety', sortable: true },
    { id: 'quantity', label: 'Quantity (kg)', accessor: 'quantity', sortable: true, alignment: 'right' },
    { id: 'price', label: 'Price (₹/kg)', accessor: 'price', sortable: true, alignment: 'right' },
    { id: 'storage', label: 'Storage', accessor: 'storage', sortable: true },
    { id: 'supplier', label: 'Supplier', accessor: 'supplier', sortable: true },
    { id: 'quality', label: 'Quality', accessor: 'quality', sortable: true },
    { id: 'status', label: 'Status', accessor: 'status', sortable: true },
    { id: 'dateReceived', label: 'Date Received', accessor: 'dateReceived', sortable: true }
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

  const handleRowClick = (stock: Stock) => {
    navigate(`/potatostock/stock/${stock.id}`);
  };

  const getSortedData = () => {
    const filteredData = stocks.filter((stock) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        stock.variety.toLowerCase().includes(searchLower) ||
        stock.storage.toLowerCase().includes(searchLower) ||
        stock.supplier.toLowerCase().includes(searchLower) ||
        stock.quality.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.field) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof Stock];
        const bValue = b[sortConfig.field as keyof Stock];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Inventory</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your potato stock inventory
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/potatostock/stock/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Stock
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
              placeholder="Search stock..."
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
            onClick={() => setStocks(mockStocks)}
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
        emptyMessage="No stock records found."
      />
    </div>
  );
};

export default StockList;
