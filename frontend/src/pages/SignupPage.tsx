import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { signupUser } from '../services/api';

interface SignupData {
  email: string;
  password: string;
  name: string;
  schoolId: string;
  role: 'admin' | 'school';
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    schoolId: '',
    role: 'school'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      console.log('Submitting signup form:', formData);
      // Using the signupUser function from api.ts to handle the signup
      const response = await signupUser(formData);
      console.log('Signup successful:', response);
      // For now, redirect to login after successful signup
      navigate('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400 dark:text-gray-300">
            Join the School Payment Portal
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-8 shadow-lg dark:shadow-amber-500/5 rounded-lg border dark:border-amber-600/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-4 border border-red-100 dark:border-red-900/30">
                <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-amber-600/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-amber-600/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-amber-600/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  School ID
                </label>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-amber-600/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  placeholder="School ID"
                  value={formData.schoolId}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-amber-600/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 sm:text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="school">School</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-yellow-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 focus:ring-offset-gray-900 disabled:opacity-50 transition-all duration-200"
              >
                <span className="inline-flex items-center">
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-sm text-center mt-6">
          <Link to="/login" className="font-medium text-amber-600 hover:text-yellow-500 transition-colors duration-200">
            Already have an account? Sign in
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-400">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;