import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaBed, FaUsers, FaCalendarAlt, FaCreditCard, FaBars, FaTimes } from 'react-icons/fa';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaCalendarAlt /> },
    { path: '/rooms', label: 'Rooms', icon: <FaBed /> },
    { path: '/guests', label: 'Guests', icon: <FaUsers /> },
    { path: '/staylogs', label: 'Bookings', icon: <FaCalendarAlt /> },
    { path: '/payments', label: 'Payments', icon: <FaCreditCard /> },
  ];
  
  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-primary-700 text-white transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 lg:h-16">
          <h1 className="text-2xl font-bold">Guesthouse</h1>
          <button 
            className="rounded-md p-1 hover:bg-primary-600 lg:hidden"
            onClick={closeSidebar}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-600 ${
                    isActiveLink(item.path) ? 'bg-primary-600' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <button 
            className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
            onClick={toggleSidebar}
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            {/* User profile or other header elements can go here */}
            <div className="text-sm">
              <span className="text-gray-500">Welcome,</span>
              <span className="ml-1 font-medium">Admin</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
          <p>Guesthouse Management System &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout; 