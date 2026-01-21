import React from 'react';
import TaskChecklist from '../../components/onboarding/TaskChecklist';

const MyTasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Complete all tasks to finish your onboarding process
          </p>
        </div>
      </div>
      <TaskChecklist />
    </div>
  );
};

export default MyTasks;