import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TransactionsTable } from '../components/TransactionsTable';
import { TransactionFilters } from '../components/TransactionFilters';
import { fetchTransactions, fetchSchools } from '../services/api';
import type { Transaction } from '../types/transaction';

const DEFAULT_PAGE_SIZE = 10;

export function TransactionsOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;

  // Load filters from URL
  const filters = {
    status: searchParams.get('status') || '',
    school_id: searchParams.get('school_id') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  };

  useEffect(() => {
    const loadSchools = async () => {
      try {
        console.log('Loading schools...');
        const schoolsData = await fetchSchools();
        console.log('Schools loaded:', schoolsData);
        setSchools(schoolsData);
      } catch (err) {
        console.error('Error loading schools:', err);
        // Set default schools as fallback
        setSchools([
          { id: 'default-school-1', name: 'Default School 1' },
          { id: 'default-school-2', name: 'Default School 2' }
        ]);
      }
    };
    loadSchools();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        console.log('Loading transactions with params:', {
          page: currentPage,
          limit: pageSize,
          ...filters
        });
        
        const response = await fetchTransactions({
          page: currentPage,
          limit: pageSize,
          ...filters,
        });
        
        console.log('Transactions loaded:', response);
        setTransactions(response.data || []);
        setTotalItems(response.total || 0);
        setError(null);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to fetch transactions. Please check server connection.');
        
        // Set default empty state
        setTransactions([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [currentPage, pageSize, filters]);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1'); // Reset to first page when filters change
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Transactions Overview</h2>
      
      <TransactionFilters 
        schoolIds={schools.map(s => s.id)} 
        onFilterChange={handleFilterChange} 
      />
      
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <TransactionsTable 
          transactions={transactions}
          itemsPerPage={pageSize}
        />
      )}
    </div>
  );
}

export default TransactionsOverview;