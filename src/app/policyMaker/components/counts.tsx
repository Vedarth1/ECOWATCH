import React from 'react';

const Counts = ({ count, name }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-full relative overflow-hidden flex flex-col items-center justify-center min-h-[100px]">
      <div className="relative z-10 text-center">
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        <div className="text-xs text-gray-500">{name}</div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
    </div>
  );
};

export default Counts;