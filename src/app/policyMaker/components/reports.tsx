import React from 'react';

const Reports = () => {
  const data = [
    { ownerName: 'John Doe', vehicleType: 'Car', location: 'New York', pucStatus: 'Valid' },
    { ownerName: 'Jane Smith', vehicleType: 'Motorcycle', location: 'Los Angeles', pucStatus: 'Invalid' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-xl text-center font-bold mb-4">Detected Vehicles</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black-100">
              <th className="p-2 text-left font-semibold">Owner Name</th>
              <th className="p-2 text-left font-semibold">Vehicle Type</th>
              <th className="p-2 text-left font-semibold">Location</th>
              <th className="p-2 text-left font-semibold">PUC Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.ownerName}</td>
                <td className="p-2">{item.vehicleType}</td>
                <td className="p-2">{item.location}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.pucStatus === 'Valid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {item.pucStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;