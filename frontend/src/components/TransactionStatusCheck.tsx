// src/components/TransactionStatusCheck.tsx
import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import type { Transaction } from '../types/transaction';
import * as apiService from '../services/api';

const TransactionStatusCheck: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiService.checkTransactionStatus(orderId);
      setTransaction(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transaction status');
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-luxury-dark rounded-lg shadow-md dark:shadow-gold/5 border dark:border-luxury-charcoal/50">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-luxury-gold to-yellow-500 flex items-center justify-center mr-4">
          <svg className="h-5 w-5 text-luxury-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-luxury-text">
          Check Transaction Status
        </h2>
      </div>

      <form onSubmit={handleCheck} className="space-y-6">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-luxury-text mb-1">
            Order ID
          </label>
          <div className="relative">
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="appearance-none block w-full px-4 py-3 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-luxury-text-secondary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-luxury-dark bg-gradient-to-r from-luxury-gold via-yellow-500 to-luxury-gold hover:from-yellow-500 hover:to-luxury-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold focus:ring-offset-luxury-dark disabled:opacity-50 transition-all duration-200"
        >
          <span className="inline-flex items-center">
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-luxury-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Checking Status...' : 'Check Status'}
          </span>
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {transaction && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-md border dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-luxury-gold mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Transaction Details
          </h3>
          
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mt-6">
            <div className="border-b dark:border-luxury-charcoal/50 pb-3 sm:border-b-0 sm:pb-0">
              <dt className="text-sm font-medium text-gray-500 dark:text-luxury-text-secondary">Order ID</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-luxury-text">{transaction.custom_order_id}</dd>
            </div>
            <div className="border-b dark:border-luxury-charcoal/50 pb-3 sm:border-b-0 sm:pb-0">
              <dt className="text-sm font-medium text-gray-500 dark:text-luxury-text-secondary">Transaction ID</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-luxury-text">{transaction.collect_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-luxury-text-secondary">Amount</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-luxury-gold">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(transaction.order_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-luxury-text-secondary">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={transaction.status} />
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default TransactionStatusCheck;