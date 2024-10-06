import React from 'react';

const CountCard: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-56 h-56 rounded-full bg-gradient-to-t from-[#1e81b0] to-black flex items-center justify-center shadow-lg">
        <div className="absolute w-44 h-44 rounded-full bg-[#141414] flex flex-col justify-center items-center text-white">
          <div className="text-[#00bfff] text-2xl mb-2">
            <i className="fas fa-walking"></i>
          </div>
          <div className="text-5xl font-bold">9,592</div>
          <div className="text-lg text-gray-400">6,967</div>
          <div className="text-xs text-gray-500 mt-2">7 DAYS AVG</div>
        </div>
      </div>
    </div>
  );
};

export default CountCard;
