import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, Trash2 } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { getMockGatePasses } from '../services/mockGatePassData';

interface GatePass {
  id: string;
  date: string;
  seller: string;
  vehicle: string;
  type: string;
  party: string;
  bags: string;
  weight: string;
}

const GatePassList: React.FC = () => {
  const navigate = useNavigate();
  const [gatePasses, setGatePasses] = useState<GatePass[]>(getMockGatePasses());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });

  const columns: ListColumn[] = [
    { id: 'date', label: 'Date', accessor: 'date', sortable: true },
    { id: 'seller', label: 'Seller', accessor: 'seller', sortable: true },
    { id: 'vehicle', label: 'Vehicle', accessor: 'vehicle', sortable: true },
    { id: 'type', label: 'Type', accessor: 'type', sortable: true },
    { id: 'party', label: 'Party', accessor: 'party', sortable: true },
    { id: 'bags', label: 'Bags', accessor: 'bags', sortable: true },
    { id: 'weight', label: 'Weight', accessor: 'weight', sortable: true },
    { 
      id: 'actions', 
      label: 'Delete', 
      accessor: 'id',
      alignment: 'center',
      render: (gatePass: GatePass) => (
        <div className="flex justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(gatePass.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    },
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

  const handleDelete = (id: string) => {
    // Remove the gate pass from the state
    setGatePasses(currentPasses => currentPasses.filter(pass => pass.id !== id));
  };

  const getSortedData = () => {
    const filteredData = gatePasses.filter((gatePass) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        gatePass.seller.toLowerCase().includes(searchLower) ||
        gatePass.vehicle.toLowerCase().includes(searchLower) ||
        gatePass.party.toLowerCase().includes(searchLower) ||
        gatePass.type.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.field) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof GatePass];
        const bValue = b[sortConfig.field as keyof GatePass];
        
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

  const handleRowClick = (gatePass: GatePass) => {
    // Navigate to details page or open edit modal
    console.log(`View gate pass with ID: ${gatePass.id}`);
  };

  const formattedGatePasses = getSortedData().map(gp => ({
    ...gp,
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    date: new Date(gp.date).toLocaleDateString('en-GB'),
    // Add kg to weight
    weight: `${gp.weight} क्विंटल`
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">जारी होने वाले रिकॉर्ड</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage gate pass records
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/emandi/gatepasses/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Gate Pass
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
              placeholder="Search gate passes..."
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
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        data={formattedGatePasses}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="कोई नया गेटपास अनुरोध प्राप्त नहीं हुआ।"
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{formattedGatePasses.length}</span> of{' '}
          <span className="font-medium">{gatePasses.length}</span> results
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" disabled>
            Previous
          </Button>
          <Button variant="primary" size="sm">
            1
          </Button>
          <Button variant="ghost" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GatePassList; 