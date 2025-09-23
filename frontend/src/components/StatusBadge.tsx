// src/components/StatusBadge.tsx
import React from 'react';
import type { TransactionStatus } from '../types/transaction';

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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