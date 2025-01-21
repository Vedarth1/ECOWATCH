import React from 'react';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const baseClasses = 'bg-white shadow rounded-lg';
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b">{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);
