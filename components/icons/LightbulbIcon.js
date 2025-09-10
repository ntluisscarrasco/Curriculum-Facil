
import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.462 7.462 0 0 1-1.543.162A7.462 7.462 0 0 1 12 20.25a7.462 7.462 0 0 1-1.543-.162m3.086-2.149a8.987 8.987 0 0 1-1.087.187 8.987 8.987 0 0 1-1.087-.187m3.636 1.352a9.752 9.752 0 0 1-4.5 0m4.5 0a9.752 9.752 0 0 0-4.5 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 4.5h.008v.008H12v-.008Z" 
    />
  </svg>
);
