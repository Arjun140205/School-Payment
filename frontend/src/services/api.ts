// src/services/api.ts
import axios from 'axios';
import type { Transaction, TransactionFilters, TransactionStatus } from '../types/transaction';

interface PaginationParams {
  page: number;
  limit: number;
}

interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface School {
  id: string;
  name: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Set up request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config.method, config.url, config.data);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const loginUser = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    // Fallback for demo or when backend is not available
    if (email === 'demo@example.com' && password === 'password') {
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('auth_token', mockToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      return { token: mockToken, user: { email, name: 'Demo User', role: 'admin' } };
    }
    throw error;
  }
};

export const signupUser = async (userData: {
  email: string;
  password: string;
  name?: string;
  schoolId?: string;
  role?: 'admin' | 'school';
}) => {
  // Extract only the fields the backend expects
  const { email, password } = userData;
  const { data } = await api.post('/auth/signup', { email, password });
  return data;
};

// Transaction API functions
export const fetchTransactions = async (
  params?: PaginationParams & Partial<TransactionFilters> & { sort?: string; order?: 'asc' | 'desc' }
): Promise<TransactionResponse> => {
  const { data } = await api.get('/payments/transactions', { params });
  return data;
};

export const fetchSchoolTransactions = async (
  schoolId: string,
  params?: PaginationParams & Partial<TransactionFilters>
): Promise<TransactionResponse> => {
  const { data } = await api.get(`/payments/transactions/school/${schoolId}`, { params });
  return data;
};

export const fetchSchools = async (): Promise<School[]> => {
  const { data } = await api.get('/payments/schools');
  return data;
};

export const checkTransactionStatus = async (transactionId: string): Promise<Transaction> => {
  const { data } = await api.get(`/payments/transactions/${transactionId}/status`);
  return data;
};

export default api;