// Simple login page for testing Tailwind
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import { loginUser } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const SimpleLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', email, password);
      const data = await loginUser(email, password);
      auth.login(data.accessToken || data.token);
      console.log('Login successful');
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          <span className="block">Sign in to your account</span>
          <span className="block mt-1 text-sm font-normal text-amber-500 opacity-80">School Payment Portal</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-amber-500 hover:text-yellow-500">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-4 border border-red-100 dark:border-red-900/30">
                <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:text-gray-900 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-amber-500 disabled:opacity-50 transition-all duration-200"
              >
                <span className="inline-flex items-center">
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Signing in...' : 'Sign in'}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/signup" className="font-medium text-blue-600 dark:text-amber-500 hover:text-blue-700 dark:hover:text-amber-600 transition-colors duration-200">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Secure login • Protected by advanced encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPage;