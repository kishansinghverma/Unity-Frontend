import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, Edit, Trash2 } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ListColumn, SortConfig } from '../../../types';
import { getMockParties } from '../services/mockPartyData';

interface Party {
  id: string;
  name: string;
  mandi: string;
  state: string;
  distance: string;
  licence: string;
}

const PartyList: React.FC = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState<Party[]>(getMockParties());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const columns: ListColumn[] = [
    { id: 'name', label: 'Name', accessor: 'name', sortable: true },
    { id: 'mandi', label: 'Mandi', accessor: 'mandi', sortable: true },
    { id: 'state', label: 'State', accessor: 'state', sortable: true },
    { id: 'distance', label: 'Distance (K.M.)', accessor: 'distance', sortable: true, alignment: 'right' },
    { id: 'licence', label: 'Licence', accessor: 'licence', sortable: true },
    { 
      id: 'actions', 
      label: 'Actions', 
      accessor: 'id',
      alignment: 'center',
      render: (party: Party) => (
        <div className="flex justify-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(party.id);
            }}
            className="text-green-500 hover:text-green-700"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(party.id);
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

  const handleEdit = (id: string) => {
    navigate(`/parties/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setParties(currentParties => currentParties.filter(party => party.id !== id));
  };

  const getSortedAndFilteredData = () => {
    const filteredData = parties.filter((party) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        party.name.toLowerCase().includes(searchLower) ||
        party.mandi.toLowerCase().includes(searchLower) ||
        party.state.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.field) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof Party];
        const bValue = b[sortConfig.field as keyof Party];
        
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

  const handleRowClick = (party: Party) => {
    navigate(`/parties/${party.id}`);
  };

  const allFilteredData = getSortedAndFilteredData();
  
  // Pagination
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allFilteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">पार्टियों की सूची</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all your trading parties
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/parties/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Party
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
              placeholder="Search parties..."
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
            onClick={() => setParties(getMockParties())}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        data={currentItems}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="कोई पार्टियां नहीं मिलीं।"
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

export default PartyList; 