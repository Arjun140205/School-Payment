// src/components/Layout.tsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  name: string;
  href: string;
}

export function Layout() {
  const location = useLocation();
  const navigation: NavItem[] = [
    { name: 'Transactions', href: '/' },
    { name: 'School Transactions', href: '/school-transactions' },
    { name: 'Check Status', href: '/transaction-status' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-black transition-colors duration-300">
      <nav className="bg-white dark:bg-luxury-dark border-b border-gray-200 dark:border-luxury-gold-dark shadow-sm dark:shadow-gold-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-luxury-gold bg-clip-text dark:bg-gradient-gold">
                  <span className="flex items-center space-x-2">
                    <svg 
                      className="h-6 w-6 text-blue-600 dark:text-luxury-gold" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span>School Payments</span>
                  </span>
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'border-blue-500 dark:border-luxury-gold text-gray-900 dark:text-luxury-gold'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-luxury-gold-dark hover:text-gray-700 dark:hover:text-luxury-text-primary'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-500 dark:text-luxury-text-secondary hover:text-blue-600 dark:hover:text-luxury-gold transition-colors duration-200"
              >
                Login
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-luxury-charcoal"></div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10 transition-all duration-300">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Outlet />
            </div>
          </div>
        </main>
        <footer className="mt-8 bg-white dark:bg-luxury-dark border-t border-gray-200 dark:border-luxury-charcoal">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-luxury-text-secondary">
              © {new Date().getFullYear()} School Payment System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;