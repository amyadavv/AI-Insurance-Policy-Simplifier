import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  HiMenu,
  HiUserCircle,
  HiDocumentReport,
  HiLogout,
  HiShieldCheck,
  HiChevronDown
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';

const DashboardHeader = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Policy Dashboard';
    if (path === '/upload') return 'Upload Policy';
    if (path === '/compare') return 'Compare Quotes';
    if (path.startsWith('/compare/')) return 'Comparison Analysis';
    if (path === '/appeals') return 'Appeal Co-Pilot';
    if (path.startsWith('/appeals/')) return 'Appeal Letter Details';
    if (path.startsWith('/policy/')) return 'Policy Simplifier Analysis';
    if (path === '/agent/settings') return 'Agency Branding';
    if (path === '/hr/dashboard') return 'HR Admin Portal';
    if (path === '/employee/portal') return 'Benefits Portal';
    return 'Portal';
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-card border-theme sticky top-0 z-30"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Left: Mobile hamburger menu toggle + Current page title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-1.5 rounded-lg hover:bg-dark-100/10 dark:hover:bg-white/10 text-muted-theme hover:text-primary-theme cursor-pointer"
        >
          <HiMenu className="h-6 w-6" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-primary-theme select-none truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: User profile menu trigger and dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-dark-100/5 dark:hover:bg-white/5 cursor-pointer text-muted-theme hover:text-primary-theme transition-colors"
        >
          <div className="w-8.5 h-8.5 rounded-full bg-primary-600/10 text-primary-400 border border-primary-500/25 flex items-center justify-center font-bold text-sm tracking-wider">
            {getInitials()}
          </div>
          <span className="hidden sm:block text-xs font-semibold select-none max-w-28 truncate">
            {user?.name}
          </span>
          <HiChevronDown className="h-4 w-4 opacity-70" />
        </button>

        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2.5 w-56 rounded-2xl border shadow-xl p-2 animate-fade-in z-50"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs text-subtle-theme font-medium">Logged in as</p>
              <p className="text-sm font-bold text-primary-theme truncate">{user?.name}</p>
              <p className="text-xs text-muted-theme truncate mt-0.5">{user?.email}</p>
            </div>
            
            <div className="py-1">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2.5 text-xs text-muted-theme hover:text-primary-theme hover:bg-dark-100/10 rounded-lg"
              >
                <HiUserCircle className="h-4 w-4" />
                <span>My Policies</span>
              </Link>
              <Link
                to="/compare"
                className="flex items-center space-x-2 px-4 py-2.5 text-xs text-muted-theme hover:text-primary-theme hover:bg-dark-100/10 rounded-lg"
              >
                <HiDocumentReport className="h-4 w-4" />
                <span>Comparisons</span>
              </Link>
              {user?.role === 'hr-admin' && (
                <Link
                  to="/hr/dashboard"
                  className="flex items-center space-x-2 px-4 py-2.5 text-xs text-primary-400 font-semibold hover:bg-primary-500/5 rounded-lg"
                >
                  <HiShieldCheck className="h-4 w-4" />
                  <span>HR Admin Portal</span>
                </Link>
              )}
              {user?.role === 'employee' && (
                <Link
                  to="/employee/portal"
                  className="flex items-center space-x-2 px-4 py-2.5 text-xs text-primary-400 font-semibold hover:bg-primary-500/5 rounded-lg"
                >
                  <HiShieldCheck className="h-4 w-4" />
                  <span>Benefits Portal</span>
                </Link>
              )}
            </div>

            <div className="border-t pt-1" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-500/5 hover:text-red-400 rounded-lg cursor-pointer font-semibold"
              >
                <HiLogout className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
