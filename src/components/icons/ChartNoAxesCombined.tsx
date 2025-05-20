import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ChartNoAxesCombined: React.FC<IconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 8h18" />
      <path d="M3 16h18" />
      <path d="M4 4v16" />
      <path d="M20 4v16" />
      <path d="M7 10l3 3 3-3 4 4" />
      <rect x="6" y="14" width="2" height="4" />
      <rect x="10" y="12" width="2" height="6" />
      <rect x="14" y="13" width="2" height="5" />
      <rect x="18" y="11" width="2" height="7" />
    </svg>
  );
};

export default ChartNoAxesCombined; 