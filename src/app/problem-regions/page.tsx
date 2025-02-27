"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button'

const ProblemRegionsPage = () => {
  const router = useRouter();
  const [problemRegions, setProblemRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortMethod, setSortMethod] = useState("combined"); // Options: "combined", "puc", "ppm"

  // Extract numeric PPM value safely from potential object format
  const extractPpmValue = (ppmData) => {
    if (ppmData === null || ppmData === undefined) return 0;
    
    // If ppmData is an object with a value property
    if (typeof ppmData === 'object' && ppmData !== null) {
      return ppmData.value || 0;
    }
    
    // If ppmData is directly a number
    if (typeof ppmData === 'number') {
      return ppmData;
    }
    
    return 0; // Default fallback
  };

  // Algorithm to calculate priority score based on both invalid PUC and PPM values
  const calculatePriorityScore = (region) => {
    // Normalize values to 0-100 scale
    const invalidPucScore = ((region.invalid_count || 0) / (region.total_count || 1)) * 100;
    
    // PPM score - extract numeric value safely
    const ppmValue = extractPpmValue(region.ppm_value);
    
    // Combined score with weights - 60% invalid PUC, 40% PPM
    // These weights can be adjusted based on your business requirements
    return (invalidPucScore * 0.6) + (ppmValue * 0.4);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allregions");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (data.regions && Array.isArray(data.regions)) {
          const processedRegions = data.regions.map((region) => {
            const ppmValue = extractPpmValue(region.ppm_value);
            
            return {
              ...region,
              ppm_numeric: ppmValue,
              invalid_percentage: ((region.invalid_count || 0) / (region.total_count || 1)) * 100,
              priority_score: calculatePriorityScore({...region, ppm_value: ppmValue})
            };
          });

          // Sort regions based on the currently selected method
          const sortedRegions = sortRegions(processedRegions, sortMethod);
          
          // Take top 5 regions
          setProblemRegions(sortedRegions.slice(0, 5));
        } else {
          console.error("Regions not found in response");
          setProblemRegions([]);
        }
      } catch (err) {
        console.error("Error fetching problem regions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortMethod]);

  // Function to sort regions based on different criteria
  const sortRegions = (regions, method) => {
    switch (method) {
      case "puc":
        return [...regions].sort((a, b) => b.invalid_percentage - a.invalid_percentage);
      case "ppm":
        return [...regions].sort((a, b) => b.ppm_numeric - a.ppm_numeric);
      case "combined":
      default:
        return [...regions].sort((a, b) => b.priority_score - a.priority_score);
    }
  };

  const handleSortChange = (method) => {
    setSortMethod(method);
  };

  // Get severity class based on priority score
  const getSeverityClass = (score) => {
    if (score >= 75) return "border-red-500/50 bg-red-950/30";
    if (score >= 50) return "border-orange-500/50 bg-orange-950/30";
    return "border-yellow-500/50 bg-yellow-950/30";
  };

  // Format PPM value for display
  const formatPpmValue = (ppmData) => {
    if (ppmData === null || ppmData === undefined) return "N/A";
    
    if (typeof ppmData === 'object' && ppmData !== null) {
      const value = ppmData.value || 0;
      return `${value.toFixed(1)}`;
    }
    
    if (typeof ppmData === 'number') {
      return ppmData.toFixed(1);
    }
    
    return "N/A";
  };

  if (loading) {
    return (
      <div className="px-4 max-w-6xl mx-auto text-center">
        <div className="text-white text-base font-semibold">
          Loading problem regions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 max-w-6xl mx-auto text-center">
        <div className="text-red-500 text-base font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-6xl mx-auto text-center">
      <div className="space-y-4">
        <div className="flex items-center justify-start mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="!bg-black text-white px-3 py-1 text-sm flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="w-full !bg-black text-white">
          <CardHeader className="flex flex-col items-center">
            <CardTitle>High Priority Regions</CardTitle>
            <div className="flex mt-4 space-x-2">
              <Button 
                variant={sortMethod === "combined" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSortChange("combined")}
                className={sortMethod === "combined" ? "bg-blue-600" : "bg-gray-800"}
              >
                Combined Score
              </Button>
              <Button 
                variant={sortMethod === "puc" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSortChange("puc")}
                className={sortMethod === "puc" ? "bg-blue-600" : "bg-gray-800"}
              >
                Invalid PUC %
              </Button>
              <Button 
                variant={sortMethod === "ppm" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSortChange("ppm")}
                className={sortMethod === "ppm" ? "bg-blue-600" : "bg-gray-800"}
              >
                PPM Value
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problemRegions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No problem regions found
                </div>
              ) : (
                problemRegions.map((region, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getSeverityClass(region.priority_score)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {region.region_name}
                        </h3>
                        <p className="text-gray-400">
                          {region.city}, {region.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-semibold">
                          Priority Score: {region.priority_score.toFixed(1)}
                        </div>
                        <div className="text-red-400">
                          {region.invalid_percentage.toFixed(1)}% Invalid PUCs
                        </div>
                        <div className="text-blue-400">
                          PPM Value: {formatPpmValue(region.ppm_value)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {region.invalid_count} of {region.total_count} vehicles
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProblemRegionsPage;