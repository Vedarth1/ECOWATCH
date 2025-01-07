import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegionData } from '../types/region';

interface RegionContextType {
  regionData: RegionData | null;
  setRegionData: (data: RegionData | null) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionData, setRegionData] = useState<RegionData | null>(null);

  useEffect(() => {
    // Load region data from localStorage on mount
    const storedRegion = localStorage.getItem('regionData');
    if (storedRegion) {
      setRegionData(JSON.parse(storedRegion));
    }
  }, []);

  return (
    <RegionContext.Provider value={{ regionData, setRegionData }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}