import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TransactionsOverview } from './pages/TransactionsOverview';
import { SchoolTransactions } from './pages/SchoolTransactions';
import { TransactionStatus } from './pages/TransactionStatus';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SimpleLoginPage from './pages/SimpleLoginPage';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

import TailwindTest from './pages/TailwindTest';

export const router = createBrowserRouter([
  {
    path: '/demo',
    element: <TailwindTest />,
  },
  {
    path: '/login',
    element: <SimpleLoginPage />,
  },
  {
    path: '/login-old',
    element: <LoginPage />,
  },
  {
    path: '/test',
    element: <TailwindTest />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <TransactionsOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'school-transactions',
        element: (
          <ProtectedRoute>
            <SchoolTransactions />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transaction-status',
        element: (
          <ProtectedRoute>
            <TransactionStatus />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);