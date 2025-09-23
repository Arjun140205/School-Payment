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
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      {/* Status Filter */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={currentFilters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* School ID Filter */}
      <div>
        <label htmlFor="school_id" className="block text-sm font-medium text-gray-700">
          School
        </label>
        <select
          id="school_id"
          value={currentFilters.school_id}
          onChange={(e) => handleFilterChange('school_id', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Schools</option>
          {schoolIds.map((id) => (
            <option key={id} value={id}>
              School {id}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={currentFilters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={currentFilters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}