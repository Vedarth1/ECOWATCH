// api/pollutionApi.js
export const savePpmData = async (regionName, ppm_value) => {
  try {
    const response = await fetch('http://localhost:8000/api/ppm-value', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ regionName, ppm_value }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save PPM data');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving PPM data:', error);
    throw error;
  }
};
