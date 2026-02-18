import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon, 
  DocumentIcon, 
  UserIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  FolderIcon,        
  ClipboardIcon,    
  ShieldCheckIcon,   
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setIsHamburgerVisible(false);
  };

  const employeeNav = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: HomeIcon, gradient: 'from-indigo-500 to-purple-500' },
    { name: 'My Tasks', href: '/employee/tasks', icon: DocumentTextIcon, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Documents', href: '/employee/documents', icon: DocumentIcon, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Handbook', href: '/employee/handbook', icon: DocumentTextIcon, gradient: 'from-amber-500 to-orange-500' },
    { name: 'Profile', href: '/employee/profile', icon: UserIcon, gradient: 'from-emerald-500 to-teal-500' },
  ];

  const hrNav = [
    { name: 'Dashboard', href: '/hr/dashboard', icon: HomeIcon, gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Templates', href: '/hr/templates', icon: DocumentTextIcon, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Employees', href: '/hr/employees', icon: UserGroupIcon, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Analytics', href: '/hr/analytics', icon: ChartBarIcon, gradient: 'from-amber-500 to-orange-500' },
    { name: 'Documents', href: '/hr/documents', icon: DocumentTextIcon, gradient: 'from-cyan-500 to-blue-500' },
  ];

  const adminNav = [
    { name: 'Dashboard',      href: '/admin/dashboard',  icon: HomeIcon,        gradient: 'from-indigo-500 to-purple-500' },
    { name: 'HR Management',  href: '/admin/hr',         icon: ShieldCheckIcon, gradient: 'from-blue-500 to-cyan-500'    },
    { name: 'Employees',      href: '/admin/employees',  icon: UserGroupIcon,   gradient: 'from-violet-500 to-purple-500'},
    { name: 'Templates',      href: '/admin/templates',  icon: DocumentTextIcon,gradient: 'from-purple-500 to-pink-500'  },
    { name: 'Documents',      href: '/admin/documents',  icon: FolderIcon,      gradient: 'from-cyan-500 to-blue-500'    },
    { name: 'Audit Log',      href: '/admin/analytics',  icon: ClipboardIcon,   gradient: 'from-amber-500 to-orange-500' },
    { name: 'System Settings',href: '/admin/settings',   icon: CogIcon,         gradient: 'from-emerald-500 to-teal-500' },
  ];

  const getNavigation = () => {
    switch (user?.role) {
      case 'admin': return adminNav;
      case 'hr': return hrNav;
      default: return employeeNav;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'hr': return 'HR Manager';
      default: return 'Employee';
    }
  };

  const navigation = getNavigation();

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .nav-item {
          animation: slideInLeft 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .nav-gradient-hover {
          position: relative;
          overflow: hidden;
        }
        
        .nav-gradient-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        
        .nav-gradient-hover:hover::before {
          left: 100%;
        }

        .hamburger-trigger {
          position: fixed;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          z-index: 45;
        }

        .hamburger-button {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }

        .hamburger-trigger:hover .hamburger-button {
          opacity: 1;
        }

        .hamburger-button.visible {
          opacity: 1;
        }
      `}</style>

      <div 
        className="hamburger-trigger"
        onMouseEnter={() => setIsHamburgerVisible(true)}
        onMouseLeave={() => !isSidebarOpen && setIsHamburgerVisible(false)}
      >
        <button
          onClick={toggleSidebar}
          className={`hamburger-button ${isHamburgerVisible || isSidebarOpen ? 'visible' : ''} fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 mx-4 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out? You will need to log in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="flex-shrink-0 px-6 py-6 mt-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">OnboardPro</h1>
                <p className="text-xs text-gray-400">Onboarding System</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 mx-4 mb-6 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-indigo-300">{getRoleLabel()}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <nav className="px-4 h-full flex flex-col">
              <div className="space-y-1.5 py-2">
                {navigation.map((item, index) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `nav-item group flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 nav-gradient-hover ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-indigo-500/20 scale-[1.02]`
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-white/5 group-hover:bg-white/10'
                          }`}>
                            <item.icon className={`h-5 w-5 transition-transform duration-300 ${
                              isActive ? 'scale-110' : 'group-hover:scale-110'
                            }`} />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronRightIcon className={`h-4 w-4 transition-all duration-300 ${
                          isActive 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        }`} />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;