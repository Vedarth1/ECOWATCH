import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const ProblemRegionsCard = ({ problemRegions }) => {
  if (!problemRegions || problemRegions.length === 0) {
    return null;
  }

  return (
    <Card className="w-full bg-gray-900 text-white">
      <CardHeader className="flex flex-row items-center space-x-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <CardTitle>Critical Regions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problemRegions.map((region, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-gray-800 border border-red-500/20"
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
                    {region.pollution_ppm} PPM
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemRegionsCard;