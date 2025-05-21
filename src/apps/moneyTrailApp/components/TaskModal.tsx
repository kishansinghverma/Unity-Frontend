import React from 'react';
import { X, Calendar, Clock, MapPin, FileText, User } from 'lucide-react';
import { RecordItem } from '../data/mockData';

interface TaskModalProps {
  task: RecordItem | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                {task.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.subtitle}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">Today</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{task.date}</span>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">Office</span>
              </div>

              <div className="flex items-center text-sm">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">Assigned to you</span>
              </div>

              <div className="flex text-sm">
                <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Additional details and notes about the task will appear here. This can include any relevant information that might be helpful for completing the task.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
