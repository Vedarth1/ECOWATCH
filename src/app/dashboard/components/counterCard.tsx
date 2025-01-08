// components/counterCard.tsx
import React from 'react';

interface CounterCardProps {
    count: number;
    name: string;
}

const CounterCard: React.FC<CounterCardProps> = ({ count, name }) => {
    return (
        <div className="bg-black text-white p-2 rounded-lg w-full">
            <div className="relative">
                <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        className="text-cyan-400" 
                        strokeWidth="2"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold">{count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{name}</div>
                </div>
            </div>
        </div>
    );
};

export default CounterCard;