import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className} ${
            error ? 'border-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Checkbox; 