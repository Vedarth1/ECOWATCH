"use client";

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  size = 'md',
  disabled = false,
  type = 'button'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    inline-flex 
    items-center 
    justify-center 
    font-medium 
    rounded-md 
    transition-colors 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    bg-blue-600 
    hover:bg-blue-700 
    text-white 
    focus:ring-blue-500
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };