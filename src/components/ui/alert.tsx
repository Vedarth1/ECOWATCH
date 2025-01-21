import React from 'react';

export const Alert = ({ children, variant }: { children: React.ReactNode; variant?: 'destructive' | 'info' }) => {
  const baseClasses = 'p-4 rounded-md border';
  const variantClasses = {
    destructive: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  };

  return <div className={`${baseClasses} ${variant ? variantClasses[variant] : ''}`}>{children}</div>;
};

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm">{children}</p>
);
