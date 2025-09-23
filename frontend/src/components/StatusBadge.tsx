// src/components/StatusBadge.tsx
import React from 'react';
import type { TransactionStatus } from '../types/transaction';

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full inline-flex items-center transition-all duration-300';
  
  const normalizeStatus = (status: string): string => {
    // Normalize status values to handle both formats
    const uppercaseStatus = status.toUpperCase();
    
    if (uppercaseStatus === 'SUCCESS' || uppercaseStatus === 'COMPLETED') return 'Success';
    if (uppercaseStatus === 'PENDING') return 'Pending';
    if (uppercaseStatus === 'FAILED') return 'Failed';
    if (uppercaseStatus === 'REFUNDED') return 'Refunded';
    
    return status; // Keep original if no match
  };
  
  const normalizedStatus = normalizeStatus(status);
  
  const getStatusClasses = () => {
    switch (normalizedStatus) {
      case 'Success':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border dark:border-emerald-900/30';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border dark:border-amber-900/30';
      case 'Failed':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 dark:border dark:border-rose-900/30';
      case 'Refunded':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 dark:border dark:border-violet-900/30';
      default:
        return 'bg-cool-slate-lighter text-cool-slate-darker dark:bg-cool-slate-darker/30 dark:text-cool-slate-light dark:border dark:border-cool-slate-darker/30';
    }
  };

  const getStatusIcon = () => {
    switch (normalizedStatus) {
      case 'Success':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'Pending':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'Failed':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'Refunded':
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Display the normalized status for consistency, but preserve unknown statuses
  const displayStatus = ['Success', 'Pending', 'Failed', 'Refunded'].includes(normalizedStatus) 
    ? normalizedStatus 
    : status;

  return (
    <span className={`${baseClasses} ${getStatusClasses()}`}>
      {getStatusIcon()}
      {displayStatus}
    </span>
  );
};