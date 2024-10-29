"use client";

import { useEffect } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";

const CameraPage = () => {
  const { validationResponse, error } = useWebSocketContext();

  useEffect(() => {
    // Handle any additional logic when component mounts
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4 text-white">PUC Validation Results</h1>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {validationResponse ? (
        <div className="bg-gray-900 text-white p-4 rounded border border-gray-700">
          <h2 className="font-bold">{validationResponse.message}</h2>
          {validationResponse.response.map((result, index) => (
            <div key={index} className="mt-4 bg-black p-3 rounded border border-gray-800">
              <h3 className="font-bold text-xl text-cyan-400">{result.message}</h3>
              <div className="mt-2 space-y-2">
                <p><span className="text-gray-400">Model:</span> {result.model}</p>
                <p><span className="text-gray-400">Owner Name:</span> {result.owner_name}</p>
                <p><span className="text-gray-400">Registration Number:</span> {result.reg_no}</p>
                <p><span className="text-gray-400">Registration Type:</span> {result.reg_type_descr}</p>
                <p><span className="text-gray-400">Registration Valid Until:</span> {result.reg_upto}</p>
                <p><span className="text-gray-400">State:</span> {result.state}</p>
                <p><span className="text-gray-400">Vehicle Class:</span> {result.vehicle_class_desc}</p>
                <div className="mt-4 bg-gray-900 p-3 rounded">
                  <h4 className="font-bold text-cyan-400 mb-2">PUCC Details:</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Operation Date:</span> {result.vehicle_pucc_details.op_dt}</p>
                    <p><span className="text-gray-400">PUCC Center Number:</span> {result.vehicle_pucc_details.pucc_centreno}</p>
                    <p><span className="text-gray-400">PUCC Valid From:</span> {result.vehicle_pucc_details.pucc_from}</p>
                    <p><span className="text-gray-400">PUCC Number:</span> {result.vehicle_pucc_details.pucc_no}</p>
                    <p><span className="text-gray-400">PUCC Valid Until:</span> {result.vehicle_pucc_details.pucc_upto}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No validation results available.</p>
      )}
    </div>
  );
};

export default CameraPage;