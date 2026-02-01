import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import Sidebar from './components/common/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Employee
import EmployeeDashboard from './pages/employee/Dashboard';
import MyTasks from './pages/employee/MyTasks';
import MyDocuments from './pages/employee/MyDocuments';
import CompanyHandbook from './pages/employee/CompanyHandbook';
import Profile from './pages/employee/Profile';

// HR
import HRDashboard from './pages/hr/Dashboard';
import Templates from './pages/hr/Templates';
import Employees from './pages/hr/Employees';
import Analytics from './pages/hr/Analytics';
import CreateTemplate from './pages/hr/CreateTemplate';

// Errors
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

/* ✅ Layout Wrapper */
const AppLayout = ({ children }) => {
  const location = useLocation();

  const fullWidthRoutes = [
    '/employee/dashboard',
    '/hr/dashboard'
  ];

  const isFullWidth = fullWidthRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className={`flex-1 transition-all duration-300 md:ml-50 ${!isFullWidth ? 'pt-16' : ''}`}>
        {isFullWidth ? (
          children
        ) : (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      {/* Employee */}
                      <Route path="/employee/dashboard" element={
                        <RoleBasedRoute allowedRoles={['employee']}>
                          <EmployeeDashboard />
                        </RoleBasedRoute>
                      } />

                      <Route path="/employee/tasks" element={
                        <RoleBasedRoute allowedRoles={['employee']}>
                          <MyTasks />
                        </RoleBasedRoute>
                      } />

                      <Route path="/employee/documents" element={
                        <RoleBasedRoute allowedRoles={['employee']}>
                          <MyDocuments />
                        </RoleBasedRoute>
                      } />

                      <Route path="/employee/handbook" element={
                        <RoleBasedRoute allowedRoles={['employee']}>
                          <CompanyHandbook />
                        </RoleBasedRoute>
                      } />

                      <Route path="/employee/profile" element={
                        <RoleBasedRoute allowedRoles={['employee']}>
                          <Profile />
                        </RoleBasedRoute>
                      } />

                      {/* HR */}
                      <Route path="/hr/dashboard" element={
                        <RoleBasedRoute allowedRoles={['hr', 'admin']}>
                          <HRDashboard />
                        </RoleBasedRoute>
                      } />

                      <Route path="/hr/templates" element={
                        <RoleBasedRoute allowedRoles={['hr', 'admin']}>
                          <Templates />
                        </RoleBasedRoute>
                      } />

                      <Route path="/hr/employees" element={
                        <RoleBasedRoute allowedRoles={['hr', 'admin']}>
                          <Employees />
                        </RoleBasedRoute>
                      } />

                      <Route path="/hr/analytics" element={
                        <RoleBasedRoute allowedRoles={['hr', 'admin']}>
                          <Analytics />
                        </RoleBasedRoute>
                      } />

                      <Route path="/hr/templates/create" element={
                        <RoleBasedRoute allowedRoles={['hr', 'admin']}>
                          <CreateTemplate />
                        </RoleBasedRoute>
                      } />

                      {/* Redirect */}
                      <Route path="/dashboard" element={<Navigate to="/employee/dashboard" />} />

                      {/* Errors */}
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
