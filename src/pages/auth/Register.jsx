import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await register(userData);
      setSuccess(true);

      setTimeout(() => {
        setRedirecting(true);

        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! You can now login.',
              email: formData.email
            } 
          });
        }, 1500);
      }, 2000);
      
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-full fixed inset-0 overflow-hidden" style={{
      backgroundImage: 'url(/images/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/20 backdrop-blur-lg"></div>
      
   
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>

      <div className="absolute top-4 left-4 z-20">
        <Link to="/" className="text-white hover:text-blue-200 transition-colors flex items-center gap-2 font-medium bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative h-full w-full flex items-center justify-center px-3 sm:px-4 py-4">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-2xl">Join OnboardPro today</h2>
            <p className="text-sm sm:text-base text-white/90 drop-shadow-lg">Create your account</p>
          </div>

          {success ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-900/40 p-6 sm:p-8 border-2 border-white/60">
              <div className="text-center py-6">
  
                <div className="mx-auto mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">

                      <div className={`absolute inset-0 rounded-full border-4 border-green-200 ${redirecting ? 'animate-ping opacity-20' : ''}`}></div>

                      <svg 
                        className={`w-10 h-10 text-green-600 ${redirecting ? 'scale-110' : ''} transition-all duration-500`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="3" 
                          d="M5 13l4 4L19 7"
                          className={redirecting ? 'stroke-dasharray-24 stroke-dashoffset-0 animate-draw-check' : ''}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Welcome to OnboardPro, <span className="font-semibold">{formData.name}</span>!
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Your account has been created successfully. You will receive a confirmation email shortly.
                </p>

                {redirecting ? (
                  <div className="space-y-4">

                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <p className="text-sm text-gray-600 animate-pulse">
                        Redirecting to login...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm font-medium"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Back to Home
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-900/40 p-4 sm:p-6 border-2 border-white/60">

              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <span className="text-lg">⚠</span>
                    {apiError}
                  </p>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 border ${
                      errors.name ? 'border-red-400' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm`}
                    placeholder="John Doe"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="text-xs">⚠</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 border ${
                      errors.email ? 'border-red-400' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm`}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="text-xs">⚠</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 border ${
                        errors.password ? 'border-red-400' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="text-xs">⚠</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 border ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="text-xs">⚠</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-sm"
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500 font-medium">Or</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={handleSignIn}
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors text-xs"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes draw-check {
          0% {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dasharray: 24;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-draw-check {
          animation: draw-check 0.6s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        body {
          overflow: hidden;
        }
        
        input::placeholder {
          font-size: 0.875rem;
        }
        
        /* Smooth transitions */
        .transition-all {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Success animation container */
        .success-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;