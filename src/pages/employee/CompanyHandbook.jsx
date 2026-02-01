import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CompanyHandbook = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [readSections, setReadSections] = useState(new Set());

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome Message',
      icon: BookOpenIcon,
      gradient: 'from-indigo-500 to-purple-500',
      content: `
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Company!</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">We are thrilled to have you join our team. This handbook will guide you through our company culture, policies, and procedures.</p>
        <p class="mb-4 text-gray-700 leading-relaxed">Our mission is to create innovative solutions that make a difference in the world. We value collaboration, integrity, and excellence in everything we do.</p>
        <p class="mb-4 text-gray-700 leading-relaxed">Take time to familiarize yourself with this handbook. It contains important information that will help you succeed in your role.</p>
      `
    },
    {
      id: 'mission',
      title: 'Mission & Values',
      icon: BuildingOfficeIcon,
      gradient: 'from-blue-500 to-cyan-500',
      content: `
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p class="mb-6 text-gray-700 leading-relaxed text-lg">To deliver exceptional value to our customers through innovative products and outstanding service.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Core Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <h3 class="font-bold text-blue-900 mb-2 text-lg">Integrity</h3>
            <p class="text-blue-800">We act with honesty and transparency in all our dealings.</p>
          </div>
          <div class="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <h3 class="font-bold text-emerald-900 mb-2 text-lg">Innovation</h3>
            <p class="text-emerald-800">We embrace change and continuously seek better solutions.</p>
          </div>
          <div class="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <h3 class="font-bold text-purple-900 mb-2 text-lg">Collaboration</h3>
            <p class="text-purple-800">We believe in the power of teamwork and shared success.</p>
          </div>
          <div class="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
            <h3 class="font-bold text-amber-900 mb-2 text-lg">Excellence</h3>
            <p class="text-amber-800">We strive for the highest standards in everything we do.</p>
          </div>
        </div>
      `
    },
    {
      id: 'policies',
      title: 'Company Policies',
      icon: ShieldCheckIcon,
      gradient: 'from-emerald-500 to-teal-500',
      content: `
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Code of Conduct</h2>
        <p class="mb-4 text-gray-700">All employees are expected to adhere to our Code of Conduct, which includes:</p>
        <ul class="list-disc pl-5 mb-6 space-y-2 text-gray-700">
          <li>Treat all colleagues with respect and professionalism</li>
          <li>Maintain confidentiality of company information</li>
          <li>Avoid conflicts of interest</li>
          <li>Use company resources responsibly</li>
          <li>Report any unethical behavior</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Work Hours & Attendance</h2>
        <p class="mb-6 text-gray-700">Standard work hours are 9:00 AM to 5:00 PM, Monday through Friday. Flexible work arrangements may be available based on your role and manager approval.</p>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Leave Policy</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <span class="font-semibold text-gray-800">Annual Leave</span>
            <span class="text-gray-900 font-bold">20 days per year</span>
          </div>
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <span class="font-semibold text-gray-800">Sick Leave</span>
            <span class="text-gray-900 font-bold">10 days per year</span>
          </div>
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <span class="font-semibold text-gray-800">Maternity/Paternity</span>
            <span class="text-gray-900 font-bold">12 weeks paid leave</span>
          </div>
        </div>
      `
    },
    {
      id: 'benefits',
      title: 'Employee Benefits',
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-pink-500',
      content: `
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Health & Wellness</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div class="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <h3 class="font-bold text-emerald-900 mb-2 text-lg">Health Insurance</h3>
            <p class="text-emerald-800">Comprehensive medical, dental, and vision coverage</p>
          </div>
          <div class="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
            <h3 class="font-bold text-blue-900 mb-2 text-lg">Mental Health Support</h3>
            <p class="text-blue-800">Access to counseling services and wellness programs</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Professional Development</h2>
        <ul class="list-disc pl-5 mb-6 space-y-2 text-gray-700">
          <li>Annual training budget of $2,000 per employee</li>
          <li>Conference attendance support</li>
          <li>Internal mentorship program</li>
          <li>Certification reimbursement</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Workplace Amenities</h2>
        <p class="mb-4 text-gray-700">Our office includes:</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          ${['Free snacks & drinks', 'Gym access', 'Parental room', 'Quiet zones', 'Game room', 'Parking'].map(amenity => 
            `<span class="px-4 py-3 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 rounded-xl text-sm text-center font-medium border border-purple-100">${amenity}</span>`
          ).join('')}
        </div>
      `
    }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);
  const currentIndex = sections.findIndex(s => s.id === activeSection);

  const handleMarkAsRead = () => {
    const newReadSections = new Set(readSections);
    newReadSections.add(activeSection);
    setReadSections(newReadSections);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .section-btn:hover { transform: translateX(4px); }
      `}</style>

      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Company Handbook 📖
            </h1>
            <p className="text-gray-600 text-lg">
              Essential information about our company policies, benefits, and procedures
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 border border-indigo-100 shadow-sm">
            <ClockIcon className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Estimated read time</p>
              <p className="text-sm font-semibold text-gray-900">45 minutes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h2 className="text-lg font-bold text-gray-900">Contents</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {readSections.size} of {sections.length} sections read
                </p>
              </div>
              <nav className="p-3">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isRead = readSections.has(section.id);
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`section-btn w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl mb-2 ${
                        isActive
                          ? 'bg-gradient-to-r ' + section.gradient + ' text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        animation: 'slideUp 0.5s ease-out',
                        animationDelay: `${index * 50}ms`,
                        opacity: 0,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{section.title}</span>
                      </div>
                      {isRead && !isActive && (
                        <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Progress Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Reading Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Sections Completed</span>
                    <span className="font-semibold">{readSections.size}/{sections.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-2.5 transition-all duration-500"
                      style={{ width: `${(readSections.size / sections.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={handleMarkAsRead}
                  disabled={readSections.has(activeSection)}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {readSections.has(activeSection) ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircleIcon className="h-4 w-4" />
                      Already Read
                    </span>
                  ) : (
                    'Mark as Read'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${activeSectionData?.gradient} bg-opacity-10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-r ${activeSectionData?.gradient} rounded-xl shadow-md`}>
                      {activeSectionData && (
                        <activeSectionData.icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeSectionData?.title}
                    </h2>
                  </div>
                  {readSections.has(activeSection) && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                      Read
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8">
                {activeSectionData && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: activeSectionData.content }}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        if (currentIndex > 0) {
                          setActiveSection(sections[currentIndex - 1].id);
                        }
                      }}
                      disabled={currentIndex === 0}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1].id);
                        }
                      }}
                      disabled={currentIndex === sections.length - 1}
                      className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 border border-transparent rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      Next Section
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHandbook;