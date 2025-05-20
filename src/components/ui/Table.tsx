import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ListColumn, SortConfig } from '../../types';

interface TableProps<T extends { id: string }> {
  data: T[];
  columns: ListColumn[];
  onRowClick?: (item: T) => void;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  sortConfig,
  onSort,
  isLoading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-default"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => onSort && onSort(column.accessor)}
                        className="focus:outline-none"
                      >
                        <span className="flex flex-col">
                          <ChevronUp 
                            className={`w-3 h-3 ${
                              sortConfig?.field === column.accessor && sortConfig?.direction === 'asc'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400'
                            }`} 
                          />
                          <ChevronDown 
                            className={`w-3 h-3 -mt-1 ${
                              sortConfig?.field === column.accessor && sortConfig?.direction === 'desc'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400'
                            }`} 
                          />
                        </span>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
                } transition-colors`}
              >
                {columns.map((column) => {
                  const value = item[column.accessor];
                  return (
                    <td
                      key={`${item.id}-${column.id}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;