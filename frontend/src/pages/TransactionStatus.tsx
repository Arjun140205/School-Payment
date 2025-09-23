import TransactionStatusCheck from '../components/TransactionStatusCheck';
import { Link } from 'react-router-dom';

export function TransactionStatus() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction Status</h1>
          <Link 
            to="/transactions" 
            className="mt-2 sm:mt-0 inline-flex items-center text-sm text-cool-indigo hover:text-cool-indigo-dark dark:text-cool-teal dark:hover:text-cool-teal-light transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            View All Transactions
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Check the status of your payment by entering your Order ID below.
        </p>
      </div>

      <div className="bg-gradient-to-tr from-gray-50 to-white dark:from-cool-dark-light/20 dark:to-cool-dark rounded-lg shadow-lg p-1">
        <TransactionStatusCheck />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Information</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <p>
                The Order ID is a unique identifier you received when making your payment. 
                If you did not receive an Order ID, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}