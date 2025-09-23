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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-cool-dark dark:to-cool-dark-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cool-indigo to-cool-teal flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-cool-slate-darker dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-cool-slate dark:text-cool-slate-light">
            Join the School Payment Portal
          </p>
        </div>
        
        <div className="bg-white dark:bg-cool-dark p-8 shadow-lg rounded-lg border border-gray-100 dark:border-cool-slate-darker/20 hover:shadow-xl transition-shadow duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-4 mb-4 border border-red-100 dark:border-red-800/20 animate-fade-in">
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
                <label htmlFor="name" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="schoolId" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                  School ID
                </label>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
                  placeholder="School ID"
                  value={formData.schoolId}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-cool-slate-darker dark:text-cool-slate-light mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 dark:border-cool-slate-darker/30 rounded-md shadow-sm dark:bg-cool-dark-light dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-cool-indigo/30 focus:border-cool-indigo dark:focus:border-cool-teal transition-all duration-200 sm:text-sm hover:border-cool-slate-light dark:hover:border-cool-slate-darker/50"
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
                className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-cool-indigo to-cool-teal hover:from-cool-indigo-dark hover:to-cool-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo focus:ring-offset-gray-100 dark:focus:ring-offset-cool-dark disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="inline-flex items-center">
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <Link to="/login" className="font-medium text-cool-indigo hover:text-cool-teal transition-colors duration-200 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-cool-slate dark:text-cool-slate-light">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;