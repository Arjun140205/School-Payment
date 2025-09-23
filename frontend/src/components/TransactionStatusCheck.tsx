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
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Check Transaction Status
      </h2>

      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order ID
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {transaction && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Transaction Details
          </h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{transaction.custom_order_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{transaction.collect_id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(transaction.order_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
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