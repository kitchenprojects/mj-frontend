// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLogIn } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { supabase } from '../services/supabase';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      // This line will now work
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      
      navigate('/menu');

    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        <p className="text-center text-gray-500">Login to your MJ Kitchen account</p>

        {authError && (
          <div className="flex items-center gap-3 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
            <FiAlertCircle size={20} />
            <span>{authError}</span>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
        >
          <FaGoogle size={20} />
          Sign in with Google
        </button>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>
        
        {/* Email Form (content is the same...) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ... all your form fields ... */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FiLogIn />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;