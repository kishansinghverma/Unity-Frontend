import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ActionButtonProps {
  icon: LucideIcon;
  color: 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'purple' | 'gray';
  label?: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

const bgColorMap = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  red: 'bg-red-500 hover:bg-red-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  green: 'bg-green-500 hover:bg-green-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  gray: 'bg-gray-500 hover:bg-gray-600',
};

export const ActionButton = memo(function ActionButton({ 
  icon: Icon, 
  color, 
  label, 
  onClick,
  style = {},
}: ActionButtonProps) {
  return (
    <button
      className={`h-full flex items-center justify-center w-[60px] ${bgColorMap[color]} text-white transition-colors`}
      onClick={onClick}
      style={{
        transition: 'transform 0.2s, opacity 0.2s',
        ...style
      }}
      title={label}
      aria-label={label}
    >
      <div className="flex flex-col items-center justify-center">
        <Icon size={20} />
        {label && <span className="text-xs mt-1">{label}</span>}
      </div>
    </button>
  );
});