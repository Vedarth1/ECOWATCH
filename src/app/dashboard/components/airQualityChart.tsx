// components/AirQualityChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip);

const AirQualityChart: React.FC = () => {
  // Sample data for the chart
  const data = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM'], // X-axis labels
    datasets: [
      {
        label: 'Air Quality',
        data: [50, 60, 55, 70, 65], // Sample air quality data
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Air Quality Index',
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Air Quality</h2>
      <Line data={data} options={options} />
      <p style={{ textAlign: 'center', margin: '10px 0' }}>Today +20%</p>
    </div>
  );
};

export default AirQualityChart;
