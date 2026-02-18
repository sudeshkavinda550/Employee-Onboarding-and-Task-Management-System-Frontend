import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const fullWidthRoutes = [
    '/employee/dashboard',
    '/employee/tasks',
    '/employee/documents',
    '/employee/handbook',
    '/employee/profile',
    '/hr/dashboard',
    '/hr/documents',
    '/hr/templates',
    '/hr/templates/create',
    '/hr/employees',
    '/hr/analytics',
    '/admin/dashboard',
    '/admin/hr',
    '/admin/employees',
    '/admin/templates',
    '/admin/documents',
    '/admin/analytics',
    '/admin/settings',
  ];

  const isFullWidth =
    fullWidthRoutes.includes(location.pathname) ||
    location.pathname.endsWith('/notifications');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className={`flex-1 transition-all duration-300 ${!isFullWidth ? 'pt-4' : ''}`}>
          {isFullWidth ? (
            <Outlet />
          ) : (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;