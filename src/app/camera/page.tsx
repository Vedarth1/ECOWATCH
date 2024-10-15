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
      <h1 className="text-2xl font-bold mb-4">PUC Validation Results</h1>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {validationResponse ? (
        <div className="bg-green-500 text-white p-4 rounded">
          <h2 className="font-bold">{validationResponse.message}</h2>
          {validationResponse.response.map((result, index) => (
            <div key={index} className="mt-4 bg-green-600 p-3 rounded">
              <h3 className="font-bold text-xl">{result.message}</h3>
              <div className="mt-2">
                <p><strong>Model:</strong> {result.model}</p>
                <p><strong>Owner Name:</strong> {result.owner_name}</p>
                <p><strong>Registration Number:</strong> {result.reg_no}</p>
                <p><strong>Registration Type:</strong> {result.reg_type_descr}</p>
                <p><strong>Registration Valid Until:</strong> {result.reg_upto}</p>
                <p><strong>State:</strong> {result.state}</p>
                <p><strong>Vehicle Class:</strong> {result.vehicle_class_desc}</p>
                <div className="mt-2">
                  <h4 className="font-bold">PUCC Details:</h4>
                  <p><strong>Operation Date:</strong> {result.vehicle_pucc_details.op_dt}</p>
                  <p><strong>PUCC Center Number:</strong> {result.vehicle_pucc_details.pucc_centreno}</p>
                  <p><strong>PUCC Valid From:</strong> {result.vehicle_pucc_details.pucc_from}</p>
                  <p><strong>PUCC Number:</strong> {result.vehicle_pucc_details.pucc_no}</p>
                  <p><strong>PUCC Valid Until:</strong> {result.vehicle_pucc_details.pucc_upto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No validation results available.</p>
      )}
    </div>
  );
};

export default CameraPage;
