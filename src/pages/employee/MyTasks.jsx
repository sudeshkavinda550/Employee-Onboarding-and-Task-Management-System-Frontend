import React from 'react';
import TaskChecklist from '../../components/onboarding/TaskChecklist';

const MyTasks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              My Tasks 📋
            </h1>
            <p className="text-gray-600 text-lg">
              Complete all tasks to finish your onboarding process
            </p>
          </div>
        </div>

        {/* Task Checklist */}
        <TaskChecklist />
      </div>
    </div>
  );
};

export default MyTasks;