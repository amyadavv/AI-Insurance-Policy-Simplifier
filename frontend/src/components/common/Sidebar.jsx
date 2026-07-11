import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiShieldCheck,
  HiUserCircle,
  HiDocumentReport,
  HiScale,
  HiPlus,
  HiLogout,
  HiX,
  HiSun,
  HiMoon,
  HiChevronLeft,
  HiChevronRight,
  HiColorSwatch
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { to: '/dashboard', label: 'My Policies', icon: <HiUserCircle className="h-6 w-6" /> },
    { to: '/compare', label: 'Compare Quotes', icon: <HiDocumentReport className="h-6 w-6" /> },
    { to: '/appeals', label: 'Appeal Co-Pilot', icon: <HiScale className="h-6 w-6" /> },
    { to: '/agent/settings', label: 'Agency Branding', icon: <HiColorSwatch className="h-6 w-6" /> },
  ];

  if (user?.role === 'hr-admin') {
    menuItems.push({ to: '/hr/dashboard', label: 'HR Admin Portal', icon: <HiShieldCheck className="h-6 w-6 text-green-500" /> });
  } else if (user?.role === 'employee') {
    menuItems.push({ to: '/employee/portal', label: 'Benefits Portal', icon: <HiShieldCheck className="h-6 w-6 text-indigo-500" /> });
  }

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen border-r flex flex-col justify-between sidebar-transition bg-card border-theme ${sidebarWidth} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Top Section */}
        <div>
          {/* Logo & Toggle Header */}
          <div className="flex items-center justify-between p-4 h-16 border-b border-theme relative" style={{ borderColor: 'var(--border)' }}>
            {isCollapsed ? (
              /* Collapsed Header - Hover-to-Arrow Micro-interaction */
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-12 h-12 mx-auto flex items-center justify-center relative cursor-pointer sidebar-logo-btn"
                title="Expand Sidebar"
              >
                {/* Product Logo (shrinks and fades on hover via CSS) */}
                <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 logo-icon">
                  <HiShieldCheck className="h-6 w-6 text-white" />
                </div>
                {/* Arrow Icon (fades and scales in on hover via CSS, matching closing arrow container size) */}
                <div className="absolute inset-0 flex items-center justify-center arrow-icon">
                  <div className="w-8 h-8 flex items-center justify-center border border-theme rounded-xl bg-dark-100/5 dark:bg-white/5 text-muted-theme" style={{ borderColor: 'var(--border)' }}>
                    <HiChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </button>
            ) : (
              /* Expanded Header - Brand Logo & Collapse Toggle */
              <>
                <div className="flex items-center space-x-2 overflow-hidden select-none">
                  <div className="bg-primary-600 p-1.5 rounded-lg shrink-0">
                    <HiShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-base font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent truncate select-none tracking-tight">
                    AIPolicy
                  </span>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="hidden md:flex w-8 h-8 rounded-xl hover:bg-dark-100/10 dark:hover:bg-white/10 items-center justify-center border border-theme cursor-pointer text-muted-theme hover:text-primary-theme"
                  style={{ borderColor: 'var(--border)' }}
                  title="Collapse Sidebar"
                >
                  <HiChevronLeft className="h-5 w-5" />
                </button>

                {/* Mobile Close Button */}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="md:hidden p-1 rounded-lg hover:bg-dark-100/10 dark:hover:bg-white/10 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <HiX className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Upload Action Button */}
          <div className="px-3 pt-4 pb-2">
            <Link
              to="/upload"
              onClick={() => setIsMobileOpen(false)}
              className={`smooth-btn bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 h-12 overflow-hidden ${
                isCollapsed ? 'w-12 px-0 mx-auto' : 'w-full px-4'
              }`}
            >
              <HiPlus className="h-6 w-6 shrink-0" />
              <span className={`transition-all duration-300 overflow-hidden text-sm select-none truncate ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-28 opacity-100 ml-2'}`}>
                Upload Policy
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center rounded-xl transition-all relative group overflow-hidden ${
                    isActive
                      ? 'bg-primary-600 text-white font-semibold shadow-sm'
                      : 'text-muted-theme hover:text-primary-theme hover:bg-dark-100/5 dark:hover:bg-white/5'
                  } ${isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full p-3 space-x-3'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className={`text-sm select-none truncate transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-40 opacity-100 ml-3'}`}>
                    {item.label}
                  </span>
                  
                  {/* Tooltip for Collapsed view */}
                  {isCollapsed && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all rounded-md px-2 py-1 bg-dark-200 text-white text-xs font-semibold whitespace-nowrap shadow-md pointer-events-none z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-theme space-y-3" style={{ borderColor: 'var(--border)' }}>
          {/* Light/Dark Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center rounded-xl hover:bg-dark-100/5 dark:hover:bg-white/5 border border-theme cursor-pointer justify-center text-muted-theme hover:text-primary-theme transition-all duration-300 h-12 overflow-hidden ${
              isCollapsed ? 'w-12 px-0 mx-auto' : 'w-full px-3 py-3 space-x-3'
            }`}
            style={{ borderColor: 'var(--border)' }}
          >
            {theme === 'dark' ? (
              <HiSun className="h-6 w-6 text-yellow-400 shrink-0" />
            ) : (
              <HiMoon className="h-6 w-6 text-primary-500 shrink-0" />
            )}
            <span className={`text-sm font-semibold select-none capitalize transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-28 opacity-100 ml-3'}`}>
              {theme} Mode
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-xl hover:bg-red-500/10 text-red-500 dark:text-red-400 font-semibold cursor-pointer justify-center transition-all duration-300 h-12 overflow-hidden ${
              isCollapsed ? 'w-12 px-0 mx-auto' : 'w-full px-3 py-3 space-x-3'
            }`}
          >
            <HiLogout className="h-6 w-6 shrink-0" />
            <span className={`select-none text-sm transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-28 opacity-100 ml-3'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
