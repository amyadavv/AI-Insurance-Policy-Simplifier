// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-8 shadow-xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h1 className="text-2xl font-bold text-center mb-2 text-primary-theme">Welcome Back</h1>
          <p className="text-center mb-8 text-muted-theme">
            Log in to view your simplified policies
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Email', type: 'email', value: email, set: setEmail, icon: HiMail, placeholder: 'you@example.com' },
              { label: 'Password', type: 'password', value: password, set: setPassword, icon: HiLockClosed, placeholder: 'Enter your password' },
            ].map(({ label, type, value, set, icon: Icon, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-2 text-label-theme">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-theme" />
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors text-primary-theme"
                    style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                    placeholder={placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-theme">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
