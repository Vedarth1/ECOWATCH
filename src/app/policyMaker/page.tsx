import React from 'react';
import Reports from './components/reports';
import Counts from './components/counts';

const PolicyMaker = () => {
  const metrics = [
    {
      count: 12,
      name: "Two wheelers"
    },
    {
      count: 56,
      name: "Cars(LMV)"
    },
    {
      count: 89,
      name: "Public buses"
    }
  ];

  return (
    <div className="px-6">
      <div className="space-y-6">
        <div className="text-white text-xl text-center font-semibold">
          Invalid PUC
        </div>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Counts
              key={index}
              count={metric.count}
              name={metric.name}
            />
          ))}
        </div>
        <Reports />
        <div className="flex justify-center">
          <button 
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 border border-gray-800 flex items-center space-x-2"
          >
            <span>Detail Reports</span>
            <svg 
              className="w-4 h-4 text-cyan-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default PolicyMaker;