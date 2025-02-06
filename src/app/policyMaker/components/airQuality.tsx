"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
} from 'chart.js';
import { useWebSocketContext } from '../../../context/WebSocketContext';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
);

// Custom hook to manage chart data
const useChartData = () => {
  const { pollutionData, isConnected } = useWebSocketContext();
  const [readings, setReadings] = React.useState<Array<{ timestamp: string; ppm: number }>>([]);

  React.useEffect(() => {
    if (pollutionData) {
      setReadings(prev => {
        const newReadings = [...prev, {
          timestamp: new Date().toISOString(),
          ppm: pollutionData.ppm
        }];
        // Keep only last 10 readings
        return newReadings.slice(-10);
      });
    }
  }, [pollutionData]);

  const chartData = {
    labels: readings.map(reading => 
      new Date(reading.timestamp).toLocaleTimeString().slice(0, -3)
    ),
    datasets: [
      {
        label: 'PPM',
        data: readings.map(reading => reading.ppm),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return { chartData, currentPPM: pollutionData?.ppm, isConnected };
};

const AirQualityChart: React.FC = () => {
  const { chartData, currentPPM, isConnected } = useChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'PPM',
        },
        min: 0,
        suggestedMax: Math.max(...chartData.datasets[0].data) * 1.2,
      },
    },
    animation: {
      duration: 0 // Disable animations for better performance with real-time data
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-black rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Air Quality Monitor</h2>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <Line data={chartData} options={options} />
        </div>
        
        {currentPPM !== undefined && (
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {currentPPM.toFixed(2)}
              <span className="text-lg ml-1 text-gray-600">PPM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Current Reading</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirQualityChart;