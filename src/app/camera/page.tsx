"use client";
import React, { useEffect } from "react";
import useWebSocket from "../../hooks/useWebSocket";

const Camera = () => {
  const { validationResponse, error } = useWebSocket();

  useEffect(() => {
    if (validationResponse) {
      console.log("Dashboard rendered. Current validationResponse:", validationResponse);
      if (validationResponse.response && validationResponse.response.length > 0) {
        console.log("First response element:", validationResponse.response[0]);
      } else {
        console.log("Response array is empty or undefined.");
      }
    }
  }, [validationResponse]);

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PUC Validation Dashboard</h1>
      {validationResponse ? (
        validationResponse.response && validationResponse.response.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validationResponse.response.map((result, index) => (
              <div key={index} className="bg-black shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">{result.reg_no}</h2>
                <p
                  className={`text-lg ${
                    result.message.includes("Valid") ? "text-green-600" : "text-red-600"
                  } mb-2`}
                >
                  {result.message}
                </p>
                <p>
                  <strong>Owner:</strong> {result.owner_name}
                </p>
                <p>
                  <strong>Model:</strong> {result.model}
                </p>
                <p>
                  <strong>State:</strong> {result.state}
                </p>
                <p>
                  <strong>Registration Type:</strong> {result.reg_type_descr}
                </p>
                <p>
                  <strong>Vehicle Class:</strong> {result.vehicle_class_desc}
                </p>
                <p>
                  <strong>Registration Valid Until:</strong> {result.reg_upto}
                </p>
                {result.vehicle_pucc_details && (
                  <div className="mt-2">
                    <h3 className="font-semibold">PUCC Details:</h3>
                    <p>
                      <strong>PUCC Number:</strong> {result.vehicle_pucc_details.pucc_no}
                    </p>
                    <p>
                      <strong>PUCC Center:</strong> {result.vehicle_pucc_details.pucc_centreno}
                    </p>
                    <p>
                      <strong>Valid From:</strong> {result.vehicle_pucc_details.pucc_from}
                    </p>
                    <p>
                      <strong>Valid Until:</strong> {result.vehicle_pucc_details.pucc_upto}
                    </p>
                    <p>
                      <strong>Operation Date:</strong> {result.vehicle_pucc_details.op_dt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No validation results available in the response.</p>
        )
      ) : (
        <p>Waiting for PUC validation results...</p>
      )}
    </div>
  );
};

export default Camera;
