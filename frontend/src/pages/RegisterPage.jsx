// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const success = await register(name, email, password);
    if (success) navigate('/dashboard');
  };

  const fields = [
    { label: 'Full Name', type: 'text', value: name, set: setName, icon: HiUser, placeholder: 'John Doe' },
    { label: 'Email', type: 'email', value: email, set: setEmail, icon: HiMail, placeholder: 'you@example.com' },
    { label: 'Password', type: 'password', value: password, set: setPassword, icon: HiLockClosed, placeholder: 'Min 6 characters', minLength: 6 },
    { label: 'Confirm Password', type: 'password', value: confirmPassword, set: setConfirmPassword, icon: HiLockClosed, placeholder: 'Re-enter your password' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-8 shadow-xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h1 className="text-2xl font-bold text-center mb-2 text-primary-theme">Create Account</h1>
          <p className="text-center mb-8 text-muted-theme">
            Start simplifying your insurance policies today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ label, type, value, set, icon: Icon, placeholder, minLength }) => (
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
                    minLength={minLength}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-theme">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
