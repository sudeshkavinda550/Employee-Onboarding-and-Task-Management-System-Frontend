import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  BellIcon, 
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  BellAlertIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hr':
        return '/hr/dashboard';
      default:
        return '/employee/dashboard';
    }
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard' },
          { name: 'HR Management', path: '/admin/hr' },
          { name: 'Templates', path: '/admin/templates' },
          { name: 'Analytics', path: '/admin/analytics' },
        ];
      case 'hr':
        return [
          { name: 'Dashboard', path: '/hr/dashboard' },
          { name: 'Templates', path: '/hr/templates' },
          { name: 'Employees', path: '/hr/employees' },
          { name: 'Analytics', path: '/hr/analytics' },
        ];
      default: 
        return [
          { name: 'Dashboard', path: '/employee/dashboard' },
          { name: 'My Tasks', path: '/employee/tasks' },
          { name: 'Documents', path: '/employee/documents' },
          { name: 'Handbook', path: '/employee/handbook' },
        ];
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'hr':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Admin';
      case 'hr': return 'HR';
      default: return 'Employee';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'announcement':
        return <BellAlertIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const handleViewAllNotifications = () => {
    const notificationPath = user?.role === 'employee' 
      ? '/employee/notifications' 
      : `/${user?.role}/notifications`;
    navigate(notificationPath);
    setShowNotifications(false);
  };

  const recentNotifications = notifications.slice(0, 5);

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center flex-shrink-0">
            <Link 
              to={getDashboardLink()} 
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OnboardPro
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center justify-center flex-1 mx-8">
              <div className="flex space-x-1">
                {navigationLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-30 max-h-[500px] overflow-hidden flex flex-col">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                          <p className="text-xs text-gray-500">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              markAllAsRead();
                            }}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            <CheckIcon className="h-4 w-4" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="overflow-y-auto flex-1">
                        {recentNotifications.length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No notifications</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {recentNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.is_read ? 'bg-indigo-50/30' : ''
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className={`text-sm font-semibold ${
                                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                          }`}>
                                            {notification.title}
                                          </p>
                                          {!notification.is_read && (
                                            <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                          {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                          {formatTimestamp(notification.created_at)}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {recentNotifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={handleViewAllNotifications}
                            className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700 text-center"
                          >
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-xs font-semibold rounded ${getRoleBadgeColor()}`}>
                        {getRoleLabel()}
                      </span>
                    </div>
                    
                    <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${getRoleBadgeColor()}`}>
                          {getRoleLabel()}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={user.role === 'employee' ? '/employee/profile' : `/${user.role}/settings`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircleIcon className="h-5 w-5 text-gray-500" />
                          <span>My Profile</span>
                        </Link>

                        {(user.role === 'hr' || user.role === 'admin') && (
                          <Link
                            to={`/${user.role}/settings`}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                            <span>Settings</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-1">
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;