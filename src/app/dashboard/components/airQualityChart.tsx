"use client"
import React, { useEffect, useState } from 'react';
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
import { useSensorSocket } from '../../../hooks/useSensorSocket';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
);

const AirQualityChart: React.FC = () => {
  const { sensorData, allReadings } = useSensorSocket();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'PPM',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    if (allReadings.length > 0) {
      const recentReadings = allReadings.slice(-4);
      const labels = recentReadings.map(reading => new Date(reading.timestamp).toLocaleTimeString().slice(0, -3)); // Format the time without seconds
      const data = recentReadings.map(reading => reading.ppm);
      setChartData({
        labels,
        datasets: [
          {
            label: 'PPM',
            data,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [allReadings]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
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
        // max: 100, // Adjust the max value as per your data
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Air Quality</h2>
      <Line data={chartData} options={options} />
      {sensorData && (
        <p style={{ textAlign: 'center', margin: '10px 0' }}>
          Current PPM: {sensorData.ppm.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default AirQualityChart;