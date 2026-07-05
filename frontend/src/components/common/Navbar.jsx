// frontend/src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="backdrop-blur-md border-b sticky top-0 z-50"
      style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HiShieldCheck className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              PolicySimplifier
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-muted-theme hover:text-primary-theme transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="smooth-btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Upload Policy
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-muted-theme text-sm">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-muted-theme hover:text-red-400 transition-colors text-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-muted-theme hover:text-primary-theme transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="smooth-btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="smooth-btn relative w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {theme === 'dark' ? (
                <HiSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <HiMoon className="h-5 w-5 text-primary-500" />
              )}
            </button>
          </div>

          {/* Mobile: Theme + Menu */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              {theme === 'dark' ? (
                <HiSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <HiMoon className="h-5 w-5 text-primary-500" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden pb-4 space-y-2 border-t mt-1 pt-3"
            style={{ borderColor: 'var(--border)' }}
          >
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="block px-3 py-2 text-primary-400 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Upload Policy
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-400 rounded-lg text-sm cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-sm"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-400 rounded-lg text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
