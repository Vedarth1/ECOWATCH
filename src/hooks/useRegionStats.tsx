// types/region.ts


// hooks/useRegionStats.ts
import { useState, useEffect, useCallback } from 'react';
import { RegionStats } from '../types/regionStats';

export const useRegionStats = (regionName: string | undefined) => {
    const [regionStats, setRegionStats] = useState<RegionStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRegionStats = useCallback(async () => {
        if (!regionName) {
            setLoading(false);
            setError(null);
            setRegionStats(null);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(
                `https://43.204.97.229:8000/api/regionStats/${encodeURIComponent(regionName)}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error: ${response.status}`);
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            interface ApiResponse {
                success: boolean;
                data: RegionStats;
                message?: string;
            }

            const data: ApiResponse = await response.json();
            
            if (!data || !data.success) {
                throw new Error(data?.message || 'Invalid response format');
            }

            setRegionStats(data.data);
            setError(null);

        } catch (err) {
            console.error('Error fetching region stats:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setRegionStats(null);
        } finally {
            setLoading(false);
        }
    }, [regionName]);

    useEffect(() => {
        fetchRegionStats();
        
        const intervalId = setInterval(fetchRegionStats, 30000);
        
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchRegionStats]);

    return {
        regionStats,
        loading,
        error,
        refetch: fetchRegionStats
    };
};