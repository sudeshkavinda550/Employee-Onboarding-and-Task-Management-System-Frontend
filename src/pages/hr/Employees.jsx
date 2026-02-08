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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      const employeesData = response.data?.data || response.data || [];
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = async (employee) => {
    try {
      // Fetch full employee details
      const response = await employeeAPI.getById(employee.id);
      setSelectedEmployee(response.data?.data || response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to load employee details');
    }
  };

  const handleSendReminder = async (employeeId) => {
    try {
      await employeeAPI.sendReminder(employeeId);
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
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
      toast.success('Employee created successfully');
      setShowCreateModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee');
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

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.onboarding_status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || emp.department_name === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(employees.map(e => e.department_name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="space-y-6">
        {/* Header */}
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Employee
            </button>
            <button
              onClick={fetchEmployees}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500">No employees found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleSelectEmployee(employee)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {employee.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{employee.position || 'No Position'}</p>
                    <p className="text-xs text-gray-400 truncate">{employee.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {getStatusBadge(employee.onboarding_status)}
                  <span className="text-xs text-gray-500">
                    Progress: {employee.progress_percentage || 0}%
                  </span>
                </div>
                {employee.department_name && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                      {employee.department_name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      {showDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {selectedEmployee.name} - Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">Employee ID</label>
                  <p className="text-gray-900">{selectedEmployee.employee_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedEmployee.email}</p>
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

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleSendReminder(selectedEmployee.id)}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                >
                  Send Reminder
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <CreateEmployeeModal
          onClose={handleCloseCreateModal}
          onSubmit={handleSubmitEmployee}
        />
      )}
    </div>
  );
};

const CreateEmployeeModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    department_id: '',
    start_date: new Date().toISOString().split('T')[0],
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Add New Employee</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Employees;