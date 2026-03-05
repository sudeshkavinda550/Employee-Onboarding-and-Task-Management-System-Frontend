import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');
    try {
      const user = await login(formData);
      switch (user.role) {
        case 'admin': navigate('/admin/dashboard'); break;
        case 'hr': navigate('/hr/dashboard'); break;
        default: navigate('/employee/dashboard'); break;
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'fixed',
      inset: 0,
      backgroundImage: 'url(/images/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .login-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%);
        }
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 0 16px;
        }
        .login-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .login-input.error {
          border-color: #ef4444;
        }
        .login-input.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease, transform 0.1s ease;
          font-family: inherit;
        }
        .login-btn:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .back-link {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.85);
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 10px;
          background: rgba(0,0,0,0.25);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .back-link:hover {
          background: rgba(0,0,0,0.4);
          color: #fff;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div className="login-overlay"></div>

      <Link to="/" className="back-link">
        <span>←</span>
        <span>Back to Home</span>
      </Link>

      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: 44, height: 44,
            background: '#2563eb',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>O</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
            Log in to your OnboardPro account
          </p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '28px 28px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}>
          {apiError && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>⚠</span>
              <p style={{ fontSize: 13.5, color: '#dc2626', margin: 0 }}>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`login-input${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p style={{ fontSize: 12.5, color: '#ef4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`login-input${errors.password ? ' error' : ''}`}
                  placeholder="••••••••"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: 12.5, color: '#ef4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="remember-me"
                  style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#2563eb' }}
                />
                <span style={{ fontSize: 13, color: '#64748b' }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#2563eb', fontFamily: 'inherit', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="login-btn" style={{ marginTop: 4 }}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
            <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 500 }}>Or</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#2563eb', fontFamily: 'inherit', padding: 0 }}
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;