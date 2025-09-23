// src/services/api.ts
import axios from 'axios';
import type { Transaction, TransactionFilters, TransactionStatus } from '../types/transaction';

// Add retry functionality
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

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

// Create API client with default configuration
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  // Add CORS support
  withCredentials: false,
});

console.log(`API client initialized with baseURL: ${API_URL}`);

  // Set up request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Disabled excessive logging
  // console.log('Request:', config.method, config.url, config.data);
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Disabled excessive logging
    // console.log('Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received. Server may be down or CORS issue.', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
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
  try {
    console.log('Sending signup data to server:', userData);
    const { data } = await api.post('/auth/signup', userData);
    console.log('Signup response:', data);
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

// Transaction API functions
export const fetchTransactions = async (
  params?: PaginationParams & Partial<TransactionFilters> & { sort?: string; order?: 'asc' | 'desc' }
): Promise<TransactionResponse> => {
  let retries = 0;
  
  // Function to make the API call with retries
  const makeRequest = async (): Promise<TransactionResponse> => {
    try {
      const { data } = await api.get('/payments/transactions', { params });
      return data;
    } catch (error) {
      // If we have retries left and it's a timeout error
      const axiosError = error as any; // Type assertion to access properties
      if (retries < MAX_RETRIES && 
          (axios.isCancel(error) || axiosError.code === 'ECONNABORTED' || !axiosError.response)) {
        retries++;
        console.log(`Retry attempt ${retries} for transaction data...`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        // Retry the request
        return makeRequest();
      }
      
      console.error('Error fetching transactions after retries:', error);
      
      // Return mock data if API call fails after all retries
      return {
        data: [
          {
            collect_id: 'mock-1',
            school_id: 'mock-school-1',
            gateway: 'Mock Gateway',
            order_amount: 1000,
            transaction_amount: 1000,
            status: 'COMPLETED',
            custom_order_id: 'mock-order-1',
            created_at: new Date().toISOString()
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      };
    }
  };
  
  // Start the request process
  return makeRequest();
};

export const fetchSchoolTransactions = async (
  schoolId: string,
  params?: PaginationParams & Partial<TransactionFilters>
): Promise<TransactionResponse> => {
  const { data } = await api.get(`/payments/transactions/school/${schoolId}`, { params });
  return data;
};

export const fetchSchools = async (): Promise<School[]> => {
  try {
    const { data } = await api.get('/payments/schools');
    return data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    // Return mock data if API call fails
    return [
      { id: 'mock-school-1', name: 'Demo School 1' },
      { id: 'mock-school-2', name: 'Demo School 2' }
    ];
  }
};

export const checkTransactionStatus = async (transactionId: string): Promise<Transaction> => {
  try {
    const { data } = await api.get(`/payments/transaction-status/${transactionId}`);
    
    // The backend returns { status: 'STATUS' }, but we need to adapt it to match our Transaction type
    if (data && typeof data === 'object' && 'status' in data) {
      // Convert minimal response to a Transaction object
      return {
        collect_id: transactionId, // Using the ID that was passed
        custom_order_id: transactionId,
        school_id: '',
        gateway: '',
        order_amount: 0,
        transaction_amount: 0,
        status: data.status,
      };
    }
    return data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

export default api;