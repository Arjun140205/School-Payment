import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSchoolTransactions, fetchSchools } from '../services/api';
import { TransactionsTable } from '../components/TransactionsTable';
import type { Transaction } from '../types/transaction';

const DEFAULT_PAGE_SIZE = 10;

export function SchoolTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState(searchParams.get('school_id') || '');
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [totalItems, setTotalItems] = useState(0);

  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;

  // Fetch unique school IDs for the dropdown
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolsList = await fetchSchools();
        setSchools(schoolsList);
        
        // Auto-select first school if none selected
        if (!schoolId && schoolsList.length > 0) {
          setSchoolId(schoolsList[0].id);
          setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set('school_id', schoolsList[0].id);
            return params;
          });
        }
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        setError('Failed to load schools');
      }
    };

    loadSchools();
  }, []);

  // Fetch transactions for selected school
  useEffect(() => {
    const loadTransactions = async () => {
      if (!schoolId) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchSchoolTransactions(schoolId, {
          page: currentPage,
          limit: pageSize,
          status: searchParams.get('status') || '',
          startDate: searchParams.get('startDate') || '',
          endDate: searchParams.get('endDate') || '',
        });
        setTransactions(response.data || []);
        setTotalItems(response.total || 0);
      } catch (err) {
        setError('Failed to fetch transactions.');
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [schoolId, currentPage, pageSize, searchParams]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">School Transactions</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select School
          </label>
          <select
            id="school"
            value={schoolId}
            onChange={(e) => {
              setSchoolId(e.target.value);
              setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                if (e.target.value) {
                  params.set('school_id', e.target.value);
                } else {
                  params.delete('school_id');
                }
                params.set('page', '1'); // Reset to first page when school changes
                return params;
              });
            }}
            className="flex-grow max-w-md pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a school...</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}
      
            {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && schoolId && (
        <TransactionsTable 
          transactions={transactions} 
          itemsPerPage={pageSize}
        />
      )}

      {!loading && !error && !schoolId && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Please select a school to view its transactions.
          </p>
        </div>
      )}
    </div>
  );
}

export default SchoolTransactions;