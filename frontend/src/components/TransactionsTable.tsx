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
  const colorClasses = status === 'Success'
    ? 'bg-green-100 text-green-800'
    : status === 'Pending'
    ? 'bg-yellow-100 text-yellow-800'
    : status === 'Failed'
    ? 'bg-red-100 text-red-800'
    : 'bg-gray-100 text-gray-800';

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
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              onClick={() => handleSort('collect_id')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              Transaction ID {getSortIcon('collect_id')}
            </th>
            <th
              onClick={() => handleSort('custom_order_id')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              Order ID {getSortIcon('custom_order_id')}
            </th>
            <th
              onClick={() => handleSort('school_id')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              School ID {getSortIcon('school_id')}
            </th>
            <th
              onClick={() => handleSort('gateway')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              Gateway {getSortIcon('gateway')}
            </th>
            <th
              onClick={() => handleSort('order_amount')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              Amount {getSortIcon('order_amount')}
            </th>
            <th
              onClick={() => handleSort('status')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
            >
              Status {getSortIcon('status')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.collect_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {transaction.collect_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {transaction.custom_order_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {transaction.school_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {transaction.gateway || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(transaction.order_amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={transaction.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;