import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderEmployee, setReminderEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isFetching, setIsFetching] = useState(false); 

  useEffect(() => {
    if (!isFetching) {
      fetchEmployees();
    }
  }, []); 

  const fetchEmployees = async () => {
    if (isFetching) {
      console.log('Already fetching, skipping...');
      return;
    }
    
    try {
      setIsFetching(true);
      setLoading(true);
      const response = await employeeAPI.getAll();
      console.log('API Response:', response);
      
      let employeesData = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          employeesData = response.data;
        } 
        else if (response.data.data && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        }
        else if (response.data.employees && Array.isArray(response.data.employees)) {
          employeesData = response.data.employees;
        }
        else if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        }
      }
      
      const employeesWithProgress = await Promise.all(
        employeesData.map(async (employee) => {
          try {
            if (!employee || !employee.id) {
              console.warn('Employee missing ID:', employee);
              return {
                ...employee,
                progress_percentage: 0,
                onboarding_status: 'not_started',
                total_tasks: 0,
                completed_tasks: 0
              };
            }
            
            let progressData = {};
            try {
              const progressResponse = await employeeAPI.getProgress(employee.id);
              console.log(`Progress response for ${employee.name}:`, progressResponse.data);
              
              progressData = progressResponse.data;
              if (progressResponse.data && progressResponse.data.data) {
                progressData = progressResponse.data.data;
              }
            } catch (progressError) {
              console.warn(`Progress endpoint not available for ${employee.name}, using existing data`);
              progressData = {
                total: employee.total_tasks || 0,
                completed: employee.completed_tasks || 0,
                percentage: employee.progress_percentage || 0
              };
            }
            
            const totalTasks = progressData.total || progressData.total_tasks || 0;
            const completedTasks = progressData.completed || progressData.completed_tasks || 0;
            const progressPercentage = progressData.percentage || progressData.progress_percentage || 
              (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
            
            console.log(`Progress for ${employee.name}: ${completedTasks}/${totalTasks} = ${progressPercentage}%`);
            
            if (progressPercentage === 100 && totalTasks > 0) {
              toast.success(`${employee.name} has completed all onboarding tasks!`, {
                duration: 5000,
              });
            } else if (progressPercentage >= 75 && progressPercentage < 100) {
              toast.success(`${employee.name} is almost done! (${progressPercentage}% complete)`, {
                duration: 4000,
              });
            }
            
            let onboardingStatus = 'not_started';
            if (progressPercentage === 100) {
              onboardingStatus = 'completed';
            } else if (progressPercentage > 0) {
              onboardingStatus = 'in_progress';
            }
            
            return {
              ...employee,
              progress_percentage: progressPercentage,
              onboarding_status: onboardingStatus,
              total_tasks: totalTasks,
              completed_tasks: completedTasks
            };
          } catch (error) {
            console.error(`Error fetching tasks for employee ${employee.id}:`, error);
            return {
              ...employee,
              progress_percentage: employee.progress_percentage || 0,
              total_tasks: 0,
              completed_tasks: 0
            };
          }
        })
      );
      
      console.log('Employees with calculated progress:', employeesWithProgress);
      setEmployees(employeesWithProgress);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      setEmployees([]); 
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleSelectEmployee = async (employee) => {
    console.log('View button clicked for employee:', employee);
    try {
      const response = await employeeAPI.getById(employee.id);
      console.log('Employee details response:', response);
      
      let employeeData = response.data;
      
      if (response.data && response.data.data) {
        employeeData = response.data.data;
      } else if (response.data && response.data.employee) {
        employeeData = response.data.employee;
      }
      
      try {
        let progressData = {};
        try {
          const progressResponse = await employeeAPI.getProgress(employee.id);
          progressData = progressResponse.data;
          
          if (progressResponse.data && progressResponse.data.data) {
            progressData = progressResponse.data.data;
          }
        } catch (progressError) {
          console.warn('Progress endpoint not available, using existing employee data');
          progressData = {
            total: employee.total_tasks || employeeData.total_tasks || 0,
            completed: employee.completed_tasks || employeeData.completed_tasks || 0,
            percentage: employee.progress_percentage || employeeData.progress_percentage || 0
          };
        }
        
        employeeData.total_tasks = progressData.total || progressData.total_tasks || 0;
        employeeData.completed_tasks = progressData.completed || progressData.completed_tasks || 0;
        employeeData.progress_percentage = progressData.percentage || progressData.progress_percentage || 
          (employeeData.total_tasks > 0 
            ? Math.round((employeeData.completed_tasks / employeeData.total_tasks) * 100) 
            : 0);
      } catch (taskError) {
        console.error('Error fetching employee progress:', taskError);
        employeeData.total_tasks = employee.total_tasks || 0;
        employeeData.completed_tasks = employee.completed_tasks || 0;
        employeeData.progress_percentage = employee.progress_percentage || 0;
      }
      
      setSelectedEmployee(employeeData);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to load employee details');
    }
  };

  const handleSendReminder = async (employee) => {
    setReminderEmployee(employee);
    setShowReminderModal(true);
  };

  const handleSendReminderSubmit = async (message) => {
    try {
      await employeeAPI.sendReminder(reminderEmployee.id, { message });
      toast.success(`Reminder sent successfully to ${reminderEmployee.name}!`, {
        duration: 4000,
      });
      setShowReminderModal(false);
      setReminderEmployee(null);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder. Please try again.');
    }
  };

  const handleCreateEmployee = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmitEmployee = async (employeeData) => {
    try {
      await employeeAPI.create(employeeData);
      toast.success(`Employee "${employeeData.name}" created successfully! Welcome email sent.`, {
        duration: 5000,
      });
      setShowCreateModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message;
        
        if (errorMessage === 'Email already exists') {
          toast.error('This email is already registered. Please use a different email address.');
        } else if (errorMessage === 'Employee ID already exists') {
          toast.error('This Employee ID is already in use. Please use a different ID.');
        } else {
          toast.error(errorMessage || 'Invalid data. Please check your inputs and try again.');
        }
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to create employees.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create employee. Please try again.';
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      await employeeAPI.update(selectedEmployee.id, employeeData);
      toast.success(`Employee "${employeeData.name || selectedEmployee.name}" updated successfully!`, {
        duration: 4000
      });
      setShowEditModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      toast.error(`${errorMessage}`);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Deleting employee with ID:', employeeToDelete.id);
      
      await employeeAPI.delete(employeeToDelete.id);
      
      toast.success(`Employee "${employeeToDelete.name}" deleted successfully!`, {
        duration: 4000
      });
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      
      fetchEmployees();
      
      if (selectedEmployee && selectedEmployee.id === employeeToDelete.id) {
        setShowDetails(false);
        setSelectedEmployee(null);
      }
      
    } catch (error) {
      console.error('Error deleting employee:', error);
      
      let errorMessage = 'Failed to delete employee';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          errorMessage = 'Unauthorized: Please login again';
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to delete employees';
        } else if (status === 404) {
          errorMessage = 'Employee not found';
        } else if (status === 409) {
          errorMessage = 'Cannot delete employee: ' + (data.message || 'Employee has associated records');
        } else if (status === 500) {
          errorMessage = 'Server error: ' + (data.message || 'Please try again later');
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`${errorMessage}`, {
        duration: 5000
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'not_started': { label: 'Not Started', class: 'bg-gray-100 text-gray-700' },
      'in_progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700' },
      'completed': { label: 'Completed', class: 'bg-green-100 text-green-700' },
    };
    const badge = statusMap[status] || statusMap['not_started'];
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
    if (!emp) return false;
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.onboarding_status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || emp.department_name === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  }) : [];

  const uniqueDepartments = Array.isArray(employees) 
    ? [...new Set(employees.map(e => e?.department_name).filter(Boolean))] 
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees 👥</h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor and manage employee onboarding progress
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateEmployee}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Employee
            </button>
            <button
              onClick={fetchEmployees}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : !Array.isArray(filteredEmployees) || filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500">No employees found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {employee.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{employee.name || 'Unnamed Employee'}</h3>
                    <p className="text-sm text-gray-500 truncate">{employee.position || 'No Position'}</p>
                    <p className="text-xs text-gray-400 truncate">{employee.email || 'No Email'}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {getStatusBadge(employee.onboarding_status)}
                  <span className="text-xs text-gray-500">
                    Progress: {employee.progress_percentage || 0}%
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${employee.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {employee.completed_tasks || 0}/{employee.total_tasks || 0} tasks
                    </span>
                  </div>
                </div>
                
                {employee.department_name && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                      {employee.department_name}
                    </span>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleSelectEmployee(employee)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                    title="View Details"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(employee)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {selectedEmployee.name || 'Employee'} - Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Onboarding Progress</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e0e7ff"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (selectedEmployee.progress_percentage || 0) / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{selectedEmployee.progress_percentage || 0}%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedEmployee.total_tasks || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{selectedEmployee.completed_tasks || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="text-2xl font-bold text-amber-600">
                          {(selectedEmployee.total_tasks || 0) - (selectedEmployee.completed_tasks || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                          style={{ width: `${selectedEmployee.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">Employee ID</label>
                  <p className="text-gray-900">{selectedEmployee.employee_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedEmployee.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Position</label>
                  <p className="text-gray-900">{selectedEmployee.position || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Department</label>
                  <p className="text-gray-900">{selectedEmployee.department_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Start Date</label>
                  <p className="text-gray-900">{formatDate(selectedEmployee.start_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Status</label>
                  <div>{getStatusBadge(selectedEmployee.onboarding_status)}</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleSendReminder(selectedEmployee)}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all cursor-pointer"
                >
                  Send Reminder
                </button>
                <button
                  onClick={() => handleEditEmployee(selectedEmployee)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
                >
                  Edit Employee
                </button>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleDeleteClick(selectedEmployee);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all cursor-pointer"
                >
                  Delete Employee
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateEmployeeModal
          onClose={handleCloseCreateModal}
          onSubmit={handleSubmitEmployee}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateEmployee}
        />
      )}

      {showDeleteModal && employeeToDelete && (
        <DeleteConfirmationModal
          employee={employeeToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showReminderModal && reminderEmployee && (
        <ReminderModal
          employee={reminderEmployee}
          onClose={() => {
            setShowReminderModal(false);
            setReminderEmployee(null);
          }}
          onSend={handleSendReminderSubmit}
        />
      )}
    </div>
  );
};

const ReminderModal = ({ employee, onClose, onSend }) => {
  const [message, setMessage] = useState(
    `Hi ${employee.name},\n\nThis is a friendly reminder to complete your pending onboarding tasks.\n\nYou currently have ${(employee.total_tasks || 0) - (employee.completed_tasks || 0)} task(s) remaining.\n\nPlease log in to the onboarding portal at your earliest convenience to continue.\n\nThank you!`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    try {
      await onSend(message);
    } catch (error) {
      console.error('Error in reminder modal:', error);
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">📧 Send Reminder to {employee.name}</h2>
            <button
              onClick={onClose}
              disabled={isSending}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Employee Progress</p>
                <p className="text-xs text-blue-700 mt-1">
                  {employee.completed_tasks}/{employee.total_tasks} tasks completed ({employee.progress_percentage}%)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              disabled={isSending}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              placeholder="Enter your reminder message..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be sent via email notification
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Reminder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateEmployeeModal = ({ onClose, onSubmit }) => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employee_id: '',
    position: '',
    department_id: '',
    start_date: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      let deptData = [];
      if (Array.isArray(data)) {
        deptData = data;
      } else if (data && Array.isArray(data.data)) {
        deptData = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        deptData = data.data;
      }
      
      setDepartments(deptData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: '', color: '', width: '0%' };
    }

    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, label: '', color: '', width: '0%' },
      { score: 1, label: 'Weak', color: 'bg-red-500', width: '20%' },
      { score: 2, label: 'Fair', color: 'bg-orange-500', width: '40%' },
      { score: 3, label: 'Good', color: 'bg-yellow-500', width: '60%' },
      { score: 4, label: 'Strong', color: 'bg-blue-500', width: '80%' },
      { score: 5, label: 'Very Strong', color: 'bg-green-500', width: '100%' }
    ];

    return strengths[score];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      );
      await onSubmit(cleanedData);
    } catch (error) {
      console.log('Submission failed:', error);
      
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes('Email already exists') || errorMessage === 'Email already exists') {
          setErrors({ email: 'This email is already registered. Please use a different email address.' });
        } else if (errorMessage.includes('Employee ID already exists') || errorMessage === 'Employee ID already exists') {
          setErrors({ employee_id: 'This Employee ID is already in use. Please use a different ID.' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Add New Employee</h2>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Error</p>
                  <p className="text-xs text-red-700 mt-1">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="john.doe@company.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 animate-fade-in flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Min. 8 characters"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              
              {formData.password && (
                <div className="mt-2 animate-fade-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.score <= 2 ? 'text-red-600' : 
                      passwordStrength.score === 3 ? 'text-yellow-600' :
                      passwordStrength.score === 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-500 ease-out rounded-full`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className={`text-xs flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="text-base">{formData.password.length >= 8 ? '✓' : '○'}</span>
                      At least 8 characters
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="text-base">{/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? '✓' : '○'}</span>
                      Uppercase & lowercase letters
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="text-base">{/\d/.test(formData.password) ? '✓' : '○'}</span>
                      At least one number
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="text-base">{/[^a-zA-Z0-9]/.test(formData.password) ? '✓' : '○'}</span>
                      Special character (!@#$%^&*)
                    </p>
                  </div>
                </div>
              )}
              
              <p className="mt-1 text-xs text-gray-500">
                This password will be sent via email
              </p>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 animate-fade-in">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Employee ID <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Auto-generated if empty"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.employee_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.employee_id && (
                <p className="mt-1 text-xs text-red-600 animate-fade-in flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.employee_id}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to auto-generate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Position/Job Title
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Software Engineer"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Department
              </label>
              {loadingDepartments ? (
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center cursor-not-allowed">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">No Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              disabled={isSubmitting}
              placeholder="123 Main Street, City, State, ZIP"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-text disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Welcome Email Will Be Sent
                </p>
                <p className="text-xs text-blue-700">
                  A professional welcome email with login credentials will be automatically sent to the employee's email address.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

const EditEmployeeModal = ({ employee, onClose, onSubmit }) => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [formData, setFormData] = useState({
    name: employee.name || '',
    email: employee.email || '',
    employee_id: employee.employee_id || '',
    position: employee.position || '',
    department_id: employee.department_id || '',
    start_date: employee.start_date ? new Date(employee.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    phone: employee.phone || '',
    address: employee.address || '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      let deptData = [];
      if (Array.isArray(data)) {
        deptData = data;
      } else if (data && Array.isArray(data.data)) {
        deptData = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        deptData = data.data;
      }
      
      setDepartments(deptData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    onSubmit(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Edit Employee</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@company.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="EMP001"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Position/Job Title
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Department
              </label>
              {loadingDepartments ? (
                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center cursor-not-allowed">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                >
                  <option value="">No Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="123 Main Street, City, State, ZIP"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Update Employee Information
                </p>
                <p className="text-xs text-blue-700">
                  Changes will be saved immediately. The employee will be notified if their email or other critical information changes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ employee, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Delete {employee.name || 'Employee'}?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-red-700 font-medium">
                Employee ID: <span className="font-bold">{employee.employee_id || 'N/A'}</span>
              </p>
              <p className="text-sm text-red-700">
                Email: <span className="font-medium">{employee.email || 'N/A'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              Delete Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;