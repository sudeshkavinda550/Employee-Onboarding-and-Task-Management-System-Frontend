import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api/taskApi';
import TaskCard from './TaskCard';
import ProgressBar from './ProgressBar';

const TaskChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [tasksResponse, progressResponse] = await Promise.all([
        taskApi.getMyTasks(),
        taskApi.getTaskProgress()
      ]);
      setTasks(tasksResponse.data);
      setProgress(progressResponse.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Progress</h2>
        <ProgressBar progress={progress} />
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>{progress.completed} of {progress.total} tasks completed</span>
          <span className="font-medium">{progress.percentage}%</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Onboarding Checklist</h2>
          <p className="mt-1 text-sm text-gray-600">Complete all tasks to finish your onboarding</p>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusUpdate={updateTaskStatus}
            />
          ))}
          {tasks.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No tasks assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskChecklist;