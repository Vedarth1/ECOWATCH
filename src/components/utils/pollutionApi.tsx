// Define proper types for the API
interface PpmData {
  region_name: string;  // Changed from regionName to match API expectation
  ppm_value: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const savePpmData = async (regionName: string, ppm_value: number): Promise<ApiResponse> => {
  const requestId = `ppm_${Date.now()}`;
  
  // Input validation
  if (typeof regionName !== 'string' || regionName.trim() === '') {
    throw new Error('Invalid region name');
  }
  
  if (typeof ppm_value !== 'number' || isNaN(ppm_value)) {
    throw new Error('Invalid PPM value');
  }
  
  const payload: PpmData = {
    region_name: regionName.trim(),  // Map regionName to region_name
    ppm_value
  };
  

  try {
    const startTime = performance.now();
    
    const response = await fetch('https://43.204.97.229:8000/api/ppm-value', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId
      },
      body: JSON.stringify(payload),
    });
    
    const data: ApiResponse = await response.json();
    const duration = performance.now() - startTime;
    
    if (!response.ok) {
      console.error(`[PollutionAPI][ERROR][${new Date().toISOString()}] API returned error response`, {
        requestId,
        statusCode: response.status,
        duration: `${duration.toFixed(2)}ms`,
        ...payload,
        error: data.message
      });
      throw new Error(data.message || 'Failed to save PPM data');
    }
  
    
    return data;
  } catch (error) {
    throw error;
  }
};