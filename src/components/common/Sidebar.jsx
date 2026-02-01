import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: 'Settings', href: '/hr/settings', icon: CogIcon, gradient: 'from-emerald-500 to-teal-500' },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, gradient: 'from-indigo-500 to-purple-500' },
    { name: 'HR Management', href: '/admin/hr', icon: UserGroupIcon, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Templates', href: '/admin/templates', icon: DocumentTextIcon, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, gradient: 'from-amber-500 to-orange-500' },
    { name: 'System Settings', href: '/admin/settings', icon: CogIcon, gradient: 'from-emerald-500 to-teal-500' },
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
        
        @media (min-width: 768px) {
          body {
            padding-left: 288px;
          }
        }
      `}</style>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Logo & Brand */}
          <div className="flex-shrink-0 px-6 py-6">
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

          {/* User Info Card */}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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

          <div className="flex-shrink-0 p-4 border-t border-white/10">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;