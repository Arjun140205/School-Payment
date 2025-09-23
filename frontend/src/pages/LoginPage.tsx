import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import '../index.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await loginUser(email, password);
      auth.login(data.token);
      navigate('/'); // Redirect to main page after login
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-cool-dark dark:to-cool-dark-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-cool-dark rounded-lg shadow-lg border border-gray-100 dark:border-cool-slate-darker/20 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cool-indigo to-cool-teal flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-cool-slate-darker dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-cool-slate dark:text-cool-slate-light">
            Access the School Payment Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-800/20 animate-fade-in">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-cool-slate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-cool-slate" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cool-indigo focus:ring-cool-indigo/30 border-gray-300 dark:border-cool-slate-darker/30 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-cool-slate-dark dark:text-cool-slate">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-cool-indigo hover:text-cool-teal transition-colors duration-200 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-cool-indigo to-cool-teal hover:from-cool-indigo-dark hover:to-cool-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo focus:ring-offset-gray-100 dark:focus:ring-offset-cool-dark disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
          
          <div className="text-sm text-center mt-6">
            <Link to="/signup" className="font-medium text-cool-indigo hover:text-cool-teal transition-colors duration-200 hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;