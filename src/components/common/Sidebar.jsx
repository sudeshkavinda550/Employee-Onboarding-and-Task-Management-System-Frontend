import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HomeIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, CogIcon, DocumentIcon, UserIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();

  const employeeNav = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: HomeIcon },
    { name: 'My Tasks', href: '/employee/tasks', icon: DocumentTextIcon },
    { name: 'Documents', href: '/employee/documents', icon: DocumentIcon },
    { name: 'Handbook', href: '/employee/handbook', icon: DocumentTextIcon },
    { name: 'Profile', href: '/employee/profile', icon: UserIcon },
  ];

  const hrNav = [
    { name: 'Dashboard', href: '/hr/dashboard', icon: HomeIcon },
    { name: 'Templates', href: '/hr/templates', icon: DocumentTextIcon },
    { name: 'Employees', href: '/hr/employees', icon: UserGroupIcon },
    { name: 'Analytics', href: '/hr/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/hr/settings', icon: CogIcon },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'HR Management', href: '/admin/hr', icon: UserGroupIcon },
    { name: 'Templates', href: '/admin/templates', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'System Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const getNavigation = () => {
    switch (user?.role) {
      case 'admin': return adminNav;
      case 'hr': return hrNav;
      default: return employeeNav;
    }
  };

  const navigation = getNavigation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-semibold text-gray-900">Navigation</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;