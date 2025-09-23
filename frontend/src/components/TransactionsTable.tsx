// src/components/TransactionsTable.tsx
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Transaction, TransactionStatus } from '../types/transaction';

interface Filters {
  status: string;
  amount_min: string;
  amount_max: string;
  date_from: string;
  date_to: string;
  search: string;
}

interface SortConfig {
  key: keyof Transaction;
  direction: 'asc' | 'desc';
}

interface TransactionsTableProps {
  transactions: Transaction[];
  itemsPerPage?: number;
}

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300';
  
  const normalizedStatus = status.toUpperCase();
  let colorClasses = 'bg-cool-slate-lighter text-cool-slate-darker';
  
  if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED') {
    colorClasses = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
  } else if (normalizedStatus === 'PENDING') {
    colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  } else if (normalizedStatus === 'FAILED') {
    colorClasses = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
  } else if (normalizedStatus === 'REFUNDED') {
    colorClasses = 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

export function TransactionsTable({ transactions, itemsPerPage = 10 }: TransactionsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });

  const [filters, setFilters] = useState<Filters>({
    status: searchParams.get('status') || '',
    amount_min: searchParams.get('amount_min') || '',
    amount_max: searchParams.get('amount_max') || '',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
    search: searchParams.get('search') || '',
  });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prevConfig) => {
      const direction = prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
      setSearchParams(params => {
        params.set('sortKey', key);
        params.set('sortDirection', direction);
        return params;
      });
      return { key, direction };
    });
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));

    setSearchParams(params => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      return params;
    });
  };

  const filteredAndSortedTransactions = useMemo(() => {
    return [...transactions].filter(transaction => {
      if (filters.status && transaction.status !== filters.status) return false;
      if (filters.amount_min && transaction.order_amount < Number(filters.amount_min)) return false;
      if (filters.amount_max && transaction.order_amount > Number(filters.amount_max)) return false;
      if (filters.date_from && transaction.created_at && 
          new Date(transaction.created_at) < new Date(filters.date_from)) return false;
      if (filters.date_to && transaction.created_at && 
          new Date(transaction.created_at) > new Date(filters.date_to)) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          transaction.collect_id.toLowerCase().includes(searchLower) ||
          transaction.custom_order_id.toLowerCase().includes(searchLower) ||
          transaction.school_id.toLowerCase().includes(searchLower) ||
          transaction.gateway?.toLowerCase().includes(searchLower) ||
          transaction.status.toLowerCase().includes(searchLower)
        );
      }
      return true;
    }).sort((a, b) => {
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);

      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [transactions, filters, sortConfig]);

  const getSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  // Update page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(params => {
      params.set('page', page.toString());
      return params;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-cool-slate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 px-4 py-2 border border-gray-200 rounded-lg dark:bg-cool-dark-light dark:border-cool-slate-darker/30 dark:text-gray-200 focus:ring-2 focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal outline-none transition-all duration-200 hover:border-cool-slate-light"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-100 dark:border-cool-slate-darker/20">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-cool-slate-darker/30">
        <thead className="bg-gray-50 dark:bg-cool-dark-light">
          <tr>
            <th
              onClick={() => handleSort('collect_id')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>Transaction ID</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('collect_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('custom_order_id')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>Order ID</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('custom_order_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('school_id')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>School ID</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('school_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('gateway')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>Gateway</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('gateway')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('order_amount')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>Amount</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('order_amount')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('status')}
              className="px-6 py-3 text-left text-xs font-medium text-cool-slate-darker dark:text-cool-slate-light uppercase tracking-wider cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <span>Status</span>
                <span className="text-cool-slate dark:text-cool-teal group-hover:text-cool-indigo dark:group-hover:text-cool-teal-light transition-colors duration-200">
                  {getSortIcon('status')}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-cool-dark divide-y divide-gray-200 dark:divide-cool-slate-darker/20">
          {paginatedTransactions.length > 0 ? paginatedTransactions.map((transaction) => (
            <tr key={transaction.collect_id} className="hover:bg-gray-50 dark:hover:bg-cool-dark-light/40 transition-all duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="text-cool-slate-darker dark:text-cool-slate-light font-medium">{transaction.collect_id}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="text-cool-slate-darker dark:text-cool-slate">{transaction.custom_order_id}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="text-cool-slate-darker dark:text-cool-slate">{transaction.school_id}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="text-cool-slate-darker dark:text-cool-slate">{transaction.gateway || 'N/A'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="text-cool-slate-darker dark:text-cool-teal font-medium">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(transaction.order_amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={transaction.status} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-cool-slate dark:text-cool-slate-light">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg className="h-16 w-16 text-cool-slate-light dark:text-cool-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-base">No transactions found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md bg-white dark:bg-cool-dark-light text-cool-slate-darker dark:text-cool-slate-light disabled:opacity-50 hover:bg-gray-50 hover:border-cool-slate-light dark:hover:bg-cool-dark-lighter/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
                currentPage === page
                  ? 'bg-cool-indigo dark:bg-cool-teal border-cool-indigo dark:border-cool-teal text-white font-medium'
                  : 'bg-white dark:bg-cool-dark-light border-gray-200 dark:border-cool-slate-darker/30 text-cool-slate-darker dark:text-cool-slate-light hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md bg-white dark:bg-cool-dark-light text-cool-slate-darker dark:text-cool-slate-light disabled:opacity-50 hover:bg-gray-50 hover:border-cool-slate-light dark:hover:bg-cool-dark-lighter/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;