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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">School Payments</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;