import React, { useState } from 'react';
import { Plus, Search, Filter, RefreshCw, Trash2 } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { getMockProcessedRecords } from '../services/mockProcessedRecordsData';

interface ProcessedRecord {
  id: string;
  date: string;
  seller: string;
  vehicle: string;
  party: string;
  bags: string;
  weight: string;
  rate: string;
  amount: string;
  mode: string;
}

const ProcessedRecordsList: React.FC = () => {
  const [records, setRecords] = useState<ProcessedRecord[]>(getMockProcessedRecords());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const columns: ListColumn[] = [
    { id: 'date', label: 'Date', accessor: 'date', sortable: true },
    { id: 'seller', label: 'Seller', accessor: 'seller', sortable: true },
    { id: 'vehicle', label: 'Vehicle', accessor: 'vehicle', sortable: true },
    { id: 'party', label: 'Party', accessor: 'party', sortable: true },
    { id: 'bags', label: 'Bags', accessor: 'bags', sortable: true, alignment: 'right' },
    { id: 'weight', label: 'Weight', accessor: 'weight', sortable: true, alignment: 'right' },
    { id: 'rate', label: 'Rate', accessor: 'rate', sortable: true, alignment: 'right' },
    { id: 'amount', label: 'Amount', accessor: 'amount', sortable: true, alignment: 'right' },
    { id: 'mode', label: 'Mode', accessor: 'mode', sortable: true },
    { 
      id: 'actions', 
      label: 'Actions', 
      accessor: 'id',
      alignment: 'center',
      render: (record: ProcessedRecord) => (
        <div className="flex justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
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
    setRecords(currentRecords => currentRecords.filter(record => record.id !== id));
  };

  const getSortedAndFilteredData = () => {
    const filteredData = records.filter((record) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        record.seller.toLowerCase().includes(searchLower) ||
        record.vehicle.toLowerCase().includes(searchLower) ||
        record.party.toLowerCase().includes(searchLower) ||
        record.mode.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.field) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof ProcessedRecord];
        const bValue = b[sortConfig.field as keyof ProcessedRecord];
        
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

  const handleRowClick = (record: ProcessedRecord) => {
    // Could navigate to details page or open edit modal
    console.log(`View processed record with ID: ${record.id}`);
  };

  const allFilteredData = getSortedAndFilteredData();
  
  // Pagination
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allFilteredData.slice(indexOfFirstItem, indexOfLastItem);

  const formattedRecords = currentItems.map(record => ({
    ...record,
    // Format date from YYYY-MM-DD to DD-MM-YYYY
    date: new Date(record.date).toLocaleDateString('en-GB'),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">जारी हो चुके रिकॉर्ड</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage processed records
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => console.log('Add new processed record')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Record
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
              placeholder="Search records..."
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
            onClick={() => setRecords(getMockProcessedRecords())}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        data={formattedRecords}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="कोई प्रोसेस्ड रिकॉर्ड प्राप्त नहीं हुआ।"
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, allFilteredData.length)}</span> of{' '}
          <span className="font-medium">{allFilteredData.length}</span> results
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          
          {/* Pagination buttons */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button 
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "primary" : "ghost"} 
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages && (
              <>
                {currentPage < totalPages - 1 && <span className="px-2 self-center">...</span>}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessedRecordsList; 