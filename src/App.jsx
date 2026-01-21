// src/App.jsx (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Home Page
import Home from './pages/Home'; // Add this import

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MyTasks from './pages/employee/MyTasks';
import MyDocuments from './pages/employee/MyDocuments';
import CompanyHandbook from './pages/employee/CompanyHandbook';
import Profile from './pages/employee/Profile';

// HR Pages
import HRDashboard from './pages/hr/Dashboard';
import Templates from './pages/hr/Templates';
import Employees from './pages/hr/Employees';
import Analytics from './pages/hr/Analytics';
import CreateTemplate from './pages/hr/CreateTemplate';

// Common Pages
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Home Page (Public) */}
              <Route path="/" element={<Home />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes - Show Navbar & Sidebar only here */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 md:pl-64 pt-16">
                      <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                          <Routes>
                            {/* Employee Routes */}
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

                            {/* HR Routes */}
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

                            {/* Default Protected Route */}
                            <Route path="/dashboard" element={<Navigate to="/employee/dashboard" />} />
                            
                            {/* Error Routes */}
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;