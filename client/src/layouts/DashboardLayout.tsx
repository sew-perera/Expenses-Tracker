import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Receipt, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
    { name: 'Bills', path: '/bills', icon: <Receipt size={20} /> },
    { name: 'Warranties', path: '/warranties', icon: <ShieldCheck size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> }
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div 
        className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}
        aria-hidden="true"
      >
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-gray-600 ${sidebarOpen ? 'opacity-75 ease-out duration-300' : 'opacity-0 ease-in duration-200'}`} 
          onClick={closeSidebar}
        ></div>
        
        {/* Sidebar */}
        <div className={`relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white ${sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'}`}>
          <div className="absolute top-0 right-0 p-1 -mr-14">
            <button
              className={`flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${sidebarOpen ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'}`}
              onClick={closeSidebar}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-shrink-0 px-4 flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">ExpenseTracker</h1>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-lg font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                  onClick={closeSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
              
              <button
                onClick={() => {
                  closeSidebar();
                  logout();
                }}
                className="w-full group flex items-center px-4 py-3 text-lg font-medium rounded-md text-gray-700 hover:bg-red-100"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-blue-600">ExpenseTracker</h1>
              </div>
              
              <nav className="mt-8 flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-md font-medium rounded-md transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full mt-8 group flex items-center px-4 py-3 text-md font-medium rounded-md text-gray-700 hover:bg-red-100 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;