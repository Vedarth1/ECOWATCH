import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'YOUR_MAP_ID';
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000/api';

const libraries = ['places', 'marker'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const mapOptions = {
  mapId: MAP_ID,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  clickableIcons: true,
  disableDefaultUI: false,
  draggable: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  minZoom: 3,
  maxZoom: 20
};

const createPulsingDot = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('class', 'pulsing-dot');
  
  // Add the CSS animation to the document if it doesn't exist
  if (!document.getElementById('pulsing-dot-style')) {
    const style = document.createElement('style');
    style.id = 'pulsing-dot-style';
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      .pulsing-dot .pulse {
        animation: pulse 1.5s ease-out infinite;
        transform-origin: center;
      }
      
      .pulsing-dot .pulse-2 {
        animation-delay: 0.5s;
      }
    `;
    document.head.appendChild(style);
  }

  // Create the main dot
  const mainDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  mainDot.setAttribute('cx', '12');
  mainDot.setAttribute('cy', '12');
  mainDot.setAttribute('r', '6');
  mainDot.setAttribute('fill', '#FF0000');

  // Create two pulsing circles
  const pulse1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pulse1.setAttribute('cx', '12');
  pulse1.setAttribute('cy', '12');
  pulse1.setAttribute('r', '6');
  pulse1.setAttribute('fill', '#FF0000');
  pulse1.setAttribute('opacity', '0.5');
  pulse1.setAttribute('class', 'pulse');

  const pulse2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pulse2.setAttribute('cx', '12');
  pulse2.setAttribute('cy', '12');
  pulse2.setAttribute('r', '6');
  pulse2.setAttribute('fill', '#FF0000');
  pulse2.setAttribute('opacity', '0.5');
  pulse2.setAttribute('class', 'pulse pulse-2');

  svg.appendChild(pulse1);
  svg.appendChild(pulse2);
  svg.appendChild(mainDot);

  return svg;
};

const SearchableMap = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(11);
  const [regions, setRegions] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);
  const [error, setError] = useState(null);
  const [initialBoundsFit, setInitialBoundsFit] = useState(false);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const markersLoadedRef = useRef(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP_API_KEY,
    libraries
  });

  // Fetch regions from backend
  const fetchRegions = async () => {
    try {
      setIsLoadingRegions(true);
      setError(null);
      const response = await axios.get(`${BACKEND_API}/allregions`);
      // Only use the regions array from the response
      setRegions(response.data.regions);
    } catch (err) {
      console.error('Error fetching regions:', err);
      setError('Failed to fetch regions data');
    } finally {
      setIsLoadingRegions(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const getCoordinatesForRegion = async (region) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    const address = `${region.region_name}, ${region.city}, ${region.state}`;
    
    try {
      const response = await geocoderRef.current.geocode({ address });
      if (response.results && response.results[0]) {
        const { location } = response.results[0].geometry;
        return {
          lat: location.lat(),
          lng: location.lng()
        };
      }
      return null;
    } catch (error) {
      console.error(`Geocoding error for ${address}:`, error);
      return null;
    }
  };

  // Track user-initiated zooming
  const handleZoomChanged = () => {
    if (map && markersLoadedRef.current) {
      // Only update the zoom state if it's a user-initiated zoom
      const currentZoom = map.getZoom();
      if (currentZoom !== zoom) {
        setZoom(currentZoom);
      }
    }
  };

  useEffect(() => {
    const setupMarkers = async () => {
      if (map && regions.length > 0 && isLoaded && !markersLoadedRef.current) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        
        const newMarkers = [];
        const bounds = new window.google.maps.LatLngBounds();
        let hasValidMarkers = false;

        for (const region of regions) {
          const position = await getCoordinatesForRegion(region);
          if (!position) continue;

          const { AdvancedMarkerElement } = window.google.maps.marker;
          
          // Create pulsing dot marker
          const pulsingDot = createPulsingDot();
          
          const marker = new AdvancedMarkerElement({
            position,
            map,
            content: pulsingDot,
            title: region.region_name,
            zIndex: 1000
          });

          // Create info window content
          const content = document.createElement('div');
          content.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <h3 class="font-bold text-lg">${region.region_name}</h3>
              <p class="text-sm text-gray-600">${region.city}, ${region.state}</p>
              <div class="mt-2">
                <p>Valid: ${region.valid_count}</p>
                <p>Invalid: ${region.invalid_count}</p>
                <p>Total: ${region.total_count}</p>
              </div>
            </div>
          `;

          // Add click listener for info window
          const infoWindow = new window.google.maps.InfoWindow({
            content
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
          bounds.extend(position);
          hasValidMarkers = true;
        }

        setMarkers(newMarkers);

        // Fit bounds if we have valid markers - but only once on initial load
        if (hasValidMarkers && !initialBoundsFit) {
          map.fitBounds(bounds);
          
          // Add a listener to detect when the bounds fitting is complete
          google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            // Set a flag indicating we've done the initial bounds fit
            setInitialBoundsFit(true);
            markersLoadedRef.current = true;
            
            // After bounds fitting completes, limit the zoom level if it's too zoomed in
            const currentZoom = map.getZoom();
            if (currentZoom > 15) {
              map.setZoom(15);
            }
          });
        }
      }
    };

    setupMarkers();
  }, [map, regions, isLoaded]);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    
    // Add zoom_changed listener
    mapInstance.addListener('zoom_changed', handleZoomChanged);
    
    // Add dragend listener to update center when user drags the map
    mapInstance.addListener('dragend', () => {
      if (markersLoadedRef.current) {
        setCenter({
          lat: mapInstance.getCenter().lat(),
          lng: mapInstance.getCenter().lng()
        });
      }
    });
  };

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        setCenter(newCenter);
        setZoom(15);

        if (map) {
          map.panTo(newCenter);
          map.setZoom(15);
        }
      }
    }
  };

  if (loadError) {
    return (
      <Card className="w-full max-w-5xl mx-auto !bg-gray-900 text-white shadow-lg rounded-lg">
        <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <div className="text-red-500 text-center">
            <p className="font-semibold">Error loading Google Maps</p>
            <p className="text-sm mt-2">Please check your API configuration</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-5xl mx-auto !bg-gray-900 text-white shadow-lg rounded-lg">
        <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <div className="text-red-500 text-center">
            <p className="font-semibold">Error loading regions</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded || isLoadingRegions) {
    return (
      <Card className="w-full max-w-5xl mx-auto bg-gray-900 text-white shadow-lg rounded-lg">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto !bg-black text-white shadow-lg rounded-lg">
      <CardHeader className="space-y-1 pb-4">
        <div className="w-full">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for any location..."
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full relative rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onLoad={onMapLoad}
            options={mapOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchableMap;