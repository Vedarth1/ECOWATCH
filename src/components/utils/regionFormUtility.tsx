import React, { useState } from "react";
import { RegionData } from "../../types/region";
import { useRegion } from "../../context/regionContext";

interface RegionFormProps {
  onSubmit: (formData: RegionData) => void;
}

const RegionForm: React.FC<RegionFormProps> = ({ onSubmit }) => {
  const { setRegionData } = useRegion();
  const [formData, setFormData] = useState<RegionData>({
    regionName: "",
    city: "",
    state: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSubmit(formData);
      setRegionData(formData);
      localStorage.setItem('regionData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error submitting region form:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Enter Region Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region Name
          </label>
          <input
            type="text"
            name="regionName"
            placeholder="Enter region name"
            required
            value={formData.regionName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            placeholder="Enter state"
            required
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegionForm;