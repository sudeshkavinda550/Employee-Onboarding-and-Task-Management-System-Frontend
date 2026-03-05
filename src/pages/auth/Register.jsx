import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'employee' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });
      setSuccess(true);
      setTimeout(() => {
        setRedirecting(true);
        setTimeout(() => navigate('/login', { state: { message: 'Registration successful! You can now login.', email: formData.email } }), 1500);
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh', width: '100%', position: 'fixed', inset: 0,
      backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover',
      backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflowY: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .reg-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%); }
        .reg-input {
          width: 100%; padding: 10px 13px; border: 1.5px solid #e2e8f0; border-radius: 9px;
          background: #fff; font-size: 13.5px; color: #0f172a; outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit; box-sizing: border-box;
        }
        .reg-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .reg-input.err { border-color: #ef4444; }
        .reg-input.err:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
        .reg-btn {
          width: 100%; padding: 11px; border: none; border-radius: 9px; background: #2563eb;
          color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background 0.15s ease, transform 0.1s ease; font-family: inherit;
        }
        .reg-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .back-link-reg {
          position: absolute; top: 16px; left: 16px; z-index: 20;
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 500;
          text-decoration: none; padding: 6px 12px; border-radius: 9px;
          background: rgba(0,0,0,0.25); transition: background 0.15s ease;
        }
        .back-link-reg:hover { background: rgba(0,0,0,0.4); color: #fff; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease-out; }
        .eye-btn { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; padding: 2px; }
        .eye-btn:hover { color: #64748b; }
      `}</style>

      <div className="reg-overlay"></div>
      <Link to="/" className="back-link-reg">← Back to Home</Link>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, margin: '60px 16px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 40, height: 40, background: '#2563eb', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 20px rgba(37,99,235,0.35)' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>O</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Join OnboardPro today</h2>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', marginTop: 5 }}>Create your account</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 24px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 64, height: 64, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid #bbf7d0' }}>
                <svg width="28" height="28" fill="none" stroke="#10b981" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Registration Successful!</h3>
              <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 4 }}>Welcome to OnboardPro, <strong>{formData.name}</strong>!</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Your account has been created. You'll receive a confirmation email shortly.</p>
              {redirecting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${d}s` }}></div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Redirecting to login...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => navigate('/login')} className="reg-btn">Go to Login</button>
                  <button onClick={() => navigate('/')} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 9, background: '#f8fafc', color: '#64748b', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Back to Home</button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {apiError && (
                <div className="fade-up" style={{ padding: '10px 13px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{apiError}</p>
                </div>
              )}

              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
              ].map(({ id, label, type, placeholder, autoComplete }) => (
                <div key={id}>
                  <label htmlFor={id} style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id={id} name={id} type={type} autoComplete={autoComplete} value={formData[id]} onChange={handleChange} className={`reg-input${errors[id] ? ' err' : ''}`} placeholder={placeholder} />
                  {errors[id] && <p className="fade-up" style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>⚠ {errors[id]}</p>}
                </div>
              ))}

              {[
                { id: 'password', label: 'Password', show: showPassword, toggle: () => setShowPassword(!showPassword), autoComplete: 'new-password' },
                { id: 'confirmPassword', label: 'Confirm Password', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), autoComplete: 'new-password' },
              ].map(({ id, label, show, toggle, autoComplete }) => (
                <div key={id}>
                  <label htmlFor={id} style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label} <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input id={id} name={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} value={formData[id]} onChange={handleChange} className={`reg-input${errors[id] ? ' err' : ''}`} placeholder="••••••••" style={{ paddingRight: 40 }} />
                    <button type="button" onClick={toggle} className="eye-btn">{show ? <EyeIcon /> : <EyeOffIcon />}</button>
                  </div>
                  {errors[id] && <p className="fade-up" style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>⚠ {errors[id]}</p>}
                </div>
              ))}

              <div>
                <label htmlFor="role" style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Account Type</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="reg-input">
                  <option value="employee">Employee</option>
                  <option value="hr">HR Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input id="terms" name="terms" type="checkbox" required style={{ width: 15, height: 15, marginTop: 2, accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }} />
                <label htmlFor="terms" style={{ fontSize: 12, color: '#64748b', cursor: 'pointer', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <a href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
                </label>
              </div>

              <button type="submit" disabled={loading} className="reg-btn" style={{ marginTop: 2 }}>
                {loading ? (
                  <><div className="spinner"></div> Creating account...</>
                ) : (
                  <>Create Account <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Or</span>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
              </div>

              <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: 0 }}>
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#2563eb', fontFamily: 'inherit', padding: 0 }}>Log in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;