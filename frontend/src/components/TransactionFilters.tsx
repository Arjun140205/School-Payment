// src/components/TransactionFilters.tsx
import { useSearchParams } from 'react-router-dom';
import type { TransactionStatus } from '../types/transaction';

interface TransactionFiltersProps {
  schoolIds: string[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function TransactionFilters({ schoolIds, onFilterChange }: TransactionFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentFilters = {
    status: searchParams.get('status') || '',
    school_id: searchParams.get('school_id') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
    
    // Notify parent component
    onFilterChange(newFilters);
  };

  const statuses: TransactionStatus[] = ['Success', 'Pending', 'Failed'];

  return (
    <div className="mb-8 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filter Transactions</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              value={currentFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-amber-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* School ID Filter */}
        <div>
          <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            School
          </label>
          <div className="relative">
            <select
              id="school_id"
              value={currentFilters.school_id}
              onChange={(e) => handleFilterChange('school_id', e.target.value)}
              className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
            >
              <option value="">All Schools</option>
              {schoolIds.map((id) => (
                <option key={id} value={id}>
                  School {id}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-amber-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={currentFilters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={currentFilters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}