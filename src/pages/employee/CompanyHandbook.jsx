import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const CompanyHandbook = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [readSections, setReadSections] = useState(new Set());

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome Message',
      icon: BookOpenIcon,
      content: `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Welcome to Our Company!</h2>
        <p class="mb-4 text-gray-700">We are thrilled to have you join our team. This handbook will guide you through our company culture, policies, and procedures.</p>
        <p class="mb-4 text-gray-700">Our mission is to create innovative solutions that make a difference in the world. We value collaboration, integrity, and excellence in everything we do.</p>
        <p class="mb-4 text-gray-700">Take time to familiarize yourself with this handbook. It contains important information that will help you succeed in your role.</p>
      `
    },
    {
      id: 'mission',
      title: 'Mission & Values',
      icon: BuildingOfficeIcon,
      content: `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p class="mb-4 text-gray-700">To deliver exceptional value to our customers through innovative products and outstanding service.</p>
        
        <h2 class="text-xl font-bold text-gray-900 mb-4 mt-6">Our Core Values</h2>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-900 mb-2">Integrity</h3>
            <p class="text-blue-800">We act with honesty and transparency in all our dealings.</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">Innovation</h3>
            <p class="text-green-800">We embrace change and continuously seek better solutions.</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <h3 class="font-semibold text-purple-900 mb-2">Collaboration</h3>
            <p class="text-purple-800">We believe in the power of teamwork and shared success.</p>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <h3 class="font-semibold text-yellow-900 mb-2">Excellence</h3>
            <p class="text-yellow-800">We strive for the highest standards in everything we do.</p>
          </div>
        </div>
      `
    },
    {
      id: 'policies',
      title: 'Company Policies',
      icon: ShieldCheckIcon,
      content: `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Code of Conduct</h2>
        <p class="mb-4 text-gray-700">All employees are expected to adhere to our Code of Conduct, which includes:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">
          <li>Treat all colleagues with respect and professionalism</li>
          <li>Maintain confidentiality of company information</li>
          <li>Avoid conflicts of interest</li>
          <li>Use company resources responsibly</li>
          <li>Report any unethical behavior</li>
        </ul>

        <h2 class="text-xl font-bold text-gray-900 mb-4 mt-6">Work Hours & Attendance</h2>
        <p class="mb-4 text-gray-700">Standard work hours are 9:00 AM to 5:00 PM, Monday through Friday. Flexible work arrangements may be available based on your role and manager approval.</p>

        <h2 class="text-xl font-bold text-gray-900 mb-4 mt-6">Leave Policy</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium text-gray-700">Annual Leave</span>
            <span class="text-gray-900">20 days per year</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium text-gray-700">Sick Leave</span>
            <span class="text-gray-900">10 days per year</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium text-gray-700">Maternity/Paternity</span>
            <span class="text-gray-900">12 weeks paid leave</span>
          </div>
        </div>
      `
    },
    {
      id: 'benefits',
      title: 'Employee Benefits',
      icon: UserGroupIcon,
      content: `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Health & Wellness</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">Health Insurance</h3>
            <p class="text-green-800">Comprehensive medical, dental, and vision coverage</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-900 mb-2">Mental Health Support</h3>
            <p class="text-blue-800">Access to counseling services and wellness programs</p>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-4 mt-6">Professional Development</h2>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">
          <li>Annual training budget of $2,000 per employee</li>
          <li>Conference attendance support</li>
          <li>Internal mentorship program</li>
          <li>Certification reimbursement</li>
        </ul>

        <h2 class="text-xl font-bold text-gray-900 mb-4 mt-6">Workplace Amenities</h2>
        <p class="mb-4 text-gray-700">Our office includes:</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Free snacks & drinks', 'Gym access', 'Parental room', 'Quiet zones', 'Game room', 'Parking'].map((amenity) => (
            <span key={amenity} class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm text-center">
              {amenity}
            </span>
          ))}
        </div>
      `
    }
  ];

  const activeSectionData = sections.find(s => s.id === activeSection);

  const handleMarkAsRead = () => {
    const newReadSections = new Set(readSections);
    newReadSections.add(activeSection);
    setReadSections(newReadSections);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Handbook</h1>
          <p className="mt-1 text-sm text-gray-600">
            Essential information about our company policies, benefits, and procedures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Estimated read time: 45 minutes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contents</h2>
              <p className="mt-1 text-sm text-gray-600">
                {readSections.size} of {sections.length} sections read
              </p>
            </div>
            <nav className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isRead = readSections.has(section.id);
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md mb-1 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{section.title}</span>
                    </div>
                    {isRead && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Reading Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Sections Completed</span>
                  <span>{readSections.size}/{sections.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 rounded-full h-2"
                    style={{ width: `${(readSections.size / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={handleMarkAsRead}
                disabled={readSections.has(activeSection)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {readSections.has(activeSection) ? 'Already Read' : 'Mark as Read'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {activeSectionData && (
                      <activeSectionData.icon className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeSectionData?.title}
                  </h2>
                </div>
                {readSections.has(activeSection) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Read
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              {activeSectionData && (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeSectionData.content }}
                />
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    Next Section
                  </button>
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