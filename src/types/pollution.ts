// types/pollutionData.ts

export interface PollutionAlert {
    level: string;
    message: string;
    recommendation: string | null;
  }
  
  export interface PollutionData {
    deviceId: string;
    rawValue: number;
    voltage: number;
    ppm: number;
    timestamp: string;
    location?: string;
    airQuality: string;
    alert: PollutionAlert | null;
    trends?: {
      isIncreasing: boolean | null;
      percentageChange: number | null;
    };
  }