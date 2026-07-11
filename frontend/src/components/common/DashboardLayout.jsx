import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="flex min-h-screen bg-page text-primary-theme font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        <DashboardHeader setIsMobileOpen={setIsMobileOpen} />
        
        {/* Scrollable Viewport Page Container */}
        <main key={location.pathname} className="flex-1 overflow-y-auto bg-page animate-slide-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
