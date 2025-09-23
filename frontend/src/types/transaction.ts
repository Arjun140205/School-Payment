// src/types/transaction.ts

export interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: TransactionStatus;
  custom_order_id: string;
  created_at?: string;
  updated_at?: string;
}

export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface TransactionFilters {
  status: string;
  school_id: string;
  startDate: string;
  endDate: string;
  date?: string; // For backward compatibility
}

export interface SortConfig {
  key: keyof Transaction;
  direction: 'asc' | 'desc';
}