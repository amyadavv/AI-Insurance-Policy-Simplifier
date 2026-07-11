// frontend/src/components/common/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiShieldCheck,
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiPlus,
  HiUserCircle,
  HiDocumentReport,
  HiOutlineLogout, // Let's use HiOutlineLogout or HiLogout — HiLogout is safer.
  HiLogout
} from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Get user initial for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/compare', label: 'Compare Quotes' },
    { to: '/appeals', label: 'Appeal Co-Pilot' }
  ];

  return (
    <nav
      className="backdrop-blur-md border-b sticky top-0 z-50 transition-colors"
      style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="bg-primary-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <HiShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">
              AIPolicySimplifier
            </span>
          </Link>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="smooth-btn w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
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

            {user ? (
              <Link
                to="/dashboard"
                className="smooth-btn bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25"
              >
                Go to App
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-muted-theme hover:text-primary-theme transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="smooth-btn bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right: Menu button + Theme Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="smooth-btn w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
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

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div
            className="md:hidden pb-4 space-y-2 border-t mt-1 pt-3 animate-fade-in"
            style={{ borderColor: 'var(--border)' }}
          >
            {user ? (
              <>
                <div className="px-3 py-2 border-b mb-2" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs text-subtle-theme">Signed in as</p>
                  <p className="text-sm font-bold text-primary-theme truncate">{user.name}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2.5 text-primary-400 rounded-lg text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Go to App
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2.5 text-red-500 rounded-lg text-sm cursor-pointer font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-sm text-muted-theme"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-400 rounded-lg text-sm font-semibold"
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
