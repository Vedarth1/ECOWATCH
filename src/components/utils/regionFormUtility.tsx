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
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Region Details
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Region Name
            </label>
            <input
              type="text"
              name="regionName"
              placeholder="Enter region name"
              required
              value={formData.regionName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg
                     hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                     shadow-lg shadow-blue-500/20 font-medium"
          >
            Save Region Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegionForm;