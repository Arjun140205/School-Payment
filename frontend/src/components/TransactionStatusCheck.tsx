// src/components/TransactionStatusCheck.tsx
import React, { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import type { Transaction } from '../types/transaction';
import * as apiService from '../services/api';
import { useSearchParams } from 'react-router-dom';

const TransactionStatusCheck: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successCheck, setSuccessCheck] = useState(false);

  // Check if there's an order ID in the URL query params
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      checkStatus(orderIdParam);
    }
  }, [searchParams]);

  const checkStatus = async (id: string) => {
    setError('');
    setLoading(true);
    setSuccessCheck(false);

    try {
      const data = await apiService.checkTransactionStatus(id);
      setTransaction(data);
      setSuccessCheck(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transaction status. Please ensure you entered the correct Order ID.');
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    checkStatus(orderId);
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-cool-dark rounded-lg shadow-md border border-gray-100 dark:border-cool-slate-darker/20 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cool-indigo to-cool-teal flex items-center justify-center mr-4 shadow-md transform transition-transform duration-300 hover:scale-110">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-cool-slate-darker dark:text-white">
          Check Transaction Status
        </h2>
      </div>

      <form onSubmit={handleCheck} className="space-y-6">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
            Order ID
          </label>
          <div className="relative">
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-cool-slate dark:text-cool-slate">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs text-cool-slate-light dark:text-cool-slate-light/70">
            Enter the Order ID you received during payment.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-cool-indigo to-cool-teal hover:from-cool-indigo-dark hover:to-cool-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo focus:ring-offset-gray-100 dark:focus:ring-offset-cool-dark disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="inline-flex items-center">
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Checking Status...' : 'Check Status'}
          </span>
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-md animate-fade-in">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {transaction && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-cool-dark-light/30 rounded-md border border-gray-100 dark:border-cool-slate-darker/20 transition-all duration-300 animate-fade-in">
          {successCheck && (
            <div className="mb-4 flex items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-green-700 dark:text-green-400">Transaction found! Details below.</span>
            </div>
          )}
          
          <h3 className="text-lg font-medium text-cool-slate-darker dark:text-cool-teal mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Transaction Details
          </h3>
          
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mt-6">
            <div className="border-b border-gray-100 dark:border-cool-slate-darker/20 pb-3 sm:border-b-0 sm:pb-0">
              <dt className="text-sm font-medium text-cool-slate dark:text-cool-slate-light">Order ID</dt>
              <dd className="mt-1 text-sm font-medium text-cool-slate-darker dark:text-cool-slate">{transaction.custom_order_id}</dd>
            </div>
            <div className="border-b border-gray-100 dark:border-cool-slate-darker/20 pb-3 sm:border-b-0 sm:pb-0">
              <dt className="text-sm font-medium text-cool-slate dark:text-cool-slate-light">Transaction ID</dt>
              <dd className="mt-1 text-sm font-medium text-cool-slate-darker dark:text-cool-slate">{transaction.collect_id || 'N/A'}</dd>
            </div>
            <div className={transaction.order_amount > 0 ? "border-b border-gray-100 dark:border-cool-slate-darker/20 pb-3 sm:border-b-0 sm:pb-0" : "hidden"}>
              <dt className="text-sm font-medium text-cool-slate dark:text-cool-slate-light">Amount</dt>
              <dd className="mt-1 text-sm font-medium text-cool-slate-darker dark:text-cool-teal">
                {transaction.order_amount > 0 
                  ? new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(transaction.order_amount)
                  : 'N/A'
                }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-cool-slate dark:text-cool-slate-light">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={transaction.status} />
              </dd>
            </div>
          </dl>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-cool-slate-darker/20">
            <h4 className="text-sm font-medium text-cool-slate-darker dark:text-cool-teal mb-2">
              What does this status mean?
            </h4>
            <p className="text-xs text-cool-slate dark:text-cool-slate-light">
              {transaction.status === 'Success' || transaction.status === 'COMPLETED' 
                ? 'Your payment has been successfully processed and confirmed. The transaction is complete.'
                : transaction.status === 'Pending' || transaction.status === 'PENDING'
                ? 'Your payment is being processed. This may take a few minutes to complete. Please check again later.'
                : transaction.status === 'Failed' || transaction.status === 'FAILED'
                ? 'Unfortunately, your payment was not successful. Please try again or contact support.'
                : 'The current status of your payment is shown above. If you have questions, please contact support.'}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-xs text-cool-slate dark:text-cool-slate-light/70">
          Need help? Contact support at <span className="font-medium text-cool-indigo dark:text-cool-teal">support@schoolpay.example.com</span>
        </p>
      </div>
    </div>
  );
};

export default TransactionStatusCheck;