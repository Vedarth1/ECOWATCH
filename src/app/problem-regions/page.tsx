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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allregions");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (data.problemRegions && Array.isArray(data.problemRegions)) {
          const processedRegions = data.problemRegions.map((region) => ({
            ...region,
            invalid_percentage:
              ((region.invalid_count || 0) / (region.total_count || 1)) * 100,
          }));
          setProblemRegions(processedRegions);
        } else {
          console.error("Problem regions not found in response");
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
  }, []);

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
            <CardTitle>Regions with Highest Invalid PUC</CardTitle>
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
                    className="p-4 rounded-lg bg-gray-900 border border-red-500/20"
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
                        <div className="text-red-400">
                          {region.invalid_percentage.toFixed(1)}% Invalid PUCs
                        </div>
                        <div className="text-yellow-400">
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