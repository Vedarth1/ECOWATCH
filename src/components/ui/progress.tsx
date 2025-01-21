import React from 'react';

const Progress = ({ value = 0, className = '', indicatorClassName = '' }) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(0, value), 100);
  
  return (
    <div className={`w-full overflow-hidden rounded ${className}`}>
      <div 
        className={`h-full transition-all duration-300 ease-in-out ${indicatorClassName}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default Progress;