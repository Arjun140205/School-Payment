import { useState, useEffect, useRef } from 'react';
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

  // Use ref to track in-flight request
  const requestInProgress = useRef(false);
  const lastRequestParams = useRef('');
  
  useEffect(() => {
    // Stringify current params for comparison
    const paramsString = JSON.stringify({
      page: currentPage,
      limit: pageSize,
      ...filters
    });
    
    // Skip if identical request is in progress or same as last completed request
    if (requestInProgress.current || paramsString === lastRequestParams.current) {
      return;
    }
    
    const loadTransactions = async () => {
      try {
        requestInProgress.current = true;
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
        
        // Save last successful request params
        lastRequestParams.current = paramsString;
        
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
        requestInProgress.current = false;
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
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cool-indigo to-cool-teal flex items-center justify-center mr-4 shadow-md transform transition-transform duration-300 hover:scale-110">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-cool-slate-darker dark:text-white">Transactions Overview</h2>
      </div>
      
      <TransactionFilters 
        schoolIds={schools.map(s => s.id)} 
        onFilterChange={handleFilterChange} 
      />
      
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cool-indigo dark:border-cool-teal"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-md border border-red-100 dark:border-red-800/20 animate-fade-in">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>{error}</div>
          </div>
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