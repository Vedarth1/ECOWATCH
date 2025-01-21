import React from 'react';

export const Button = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses =
    'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};
