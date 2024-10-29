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
      </div>
    </div>
  );
};

export default PolicyMaker;