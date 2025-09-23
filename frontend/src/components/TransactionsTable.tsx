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
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  
  const normalizedStatus = status.toUpperCase();
  let colorClasses = 'bg-gray-100 text-gray-800';
  
  if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED') {
    colorClasses = 'bg-green-100 text-green-800';
  } else if (normalizedStatus === 'PENDING') {
    colorClasses = 'bg-yellow-100 text-yellow-800';
  } else if (normalizedStatus === 'FAILED') {
    colorClasses = 'bg-red-100 text-red-800';
  } else if (normalizedStatus === 'REFUNDED') {
    colorClasses = 'bg-purple-100 text-purple-800';
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
        <input
          type="text"
          placeholder="Search transactions..."
          className="luxury-input"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg dark:shadow-gold-sm border border-gray-200 dark:border-luxury-charcoal">
        <table className="luxury-table">
        <thead className="bg-gray-50 dark:bg-luxury-charcoal">
          <tr>
            <th
              onClick={() => handleSort('collect_id')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>Transaction ID</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('collect_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('custom_order_id')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>Order ID</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('custom_order_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('school_id')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>School ID</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('school_id')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('gateway')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>Gateway</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('gateway')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('order_amount')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>Amount</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('order_amount')}
                </span>
              </div>
            </th>
            <th
              onClick={() => handleSort('status')}
              className="luxury-table-header group"
            >
              <div className="flex items-center space-x-2">
                <span>Status</span>
                <span className="text-gray-400 dark:text-luxury-gold group-hover:opacity-100 transition-opacity">
                  {getSortIcon('status')}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-luxury-dark divide-y divide-gray-200 dark:divide-luxury-charcoal">
          {paginatedTransactions.length > 0 ? paginatedTransactions.map((transaction) => (
            <tr key={transaction.collect_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              <td className="luxury-table-cell">
                <span className="text-gray-900 dark:text-luxury-text-secondary font-medium">{transaction.collect_id}</span>
              </td>
              <td className="luxury-table-cell">
                <span className="text-gray-900 dark:text-luxury-text-secondary">{transaction.custom_order_id}</span>
              </td>
              <td className="luxury-table-cell">
                <span className="text-gray-900 dark:text-luxury-text-secondary">{transaction.school_id}</span>
              </td>
              <td className="luxury-table-cell">
                <span className="text-gray-900 dark:text-luxury-text-secondary">{transaction.gateway || 'N/A'}</span>
              </td>
              <td className="luxury-table-cell">
                <span className="text-gray-900 dark:text-luxury-gold font-medium">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(transaction.order_amount)}
                </span>
              </td>
              <td className="luxury-table-cell">
                <StatusBadge status={transaction.status} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-luxury-text-muted">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg className="h-10 w-10 text-gray-400 dark:text-luxury-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No transactions found</p>
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded-md transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 dark:bg-amber-500 border-blue-600 dark:border-amber-500 text-white dark:text-gray-900 font-medium'
                  : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;