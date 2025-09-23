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
    <div className="mb-8 p-6 bg-white dark:bg-cool-dark rounded-lg shadow-md border border-gray-100 dark:border-cool-slate-darker/20 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <svg className="h-5 w-5 text-cool-indigo dark:text-cool-teal mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="text-lg font-medium text-cool-slate-darker dark:text-white">Filter Transactions</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-2">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              value={currentFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-slate dark:text-cool-teal">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* School ID Filter */}
        <div>
          <label htmlFor="school_id" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-2">
            School
          </label>
          <div className="relative">
            <select
              id="school_id"
              value={currentFilters.school_id}
              onChange={(e) => handleFilterChange('school_id', e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
            >
              <option value="">All Schools</option>
              {schoolIds.map((id) => (
                <option key={id} value={id}>
                  School {id}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-slate dark:text-cool-teal">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-2">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-cool-slate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              id="startDate"
              value={currentFilters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-2">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-cool-slate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              id="endDate"
              value={currentFilters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}