import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { X, Camera as CameraIcon, Upload, RotateCcw } from 'lucide-react';

const CameraComponent = ({ onCapture, onClose }) => {
  const camera = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check for MediaDevices API support
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('MediaDevices API supported.');
      setIsCameraSupported(true);
      
      // Force camera ready state after a timeout as a fallback
      const readyTimer = setTimeout(() => {
        if (!isCameraReady && camera.current) {
          console.log('Force setting camera ready due to timeout');
          setIsCameraReady(true);
        }
      }, 2000);
      
      return () => clearTimeout(readyTimer);
    } else {
      console.error('MediaDevices API is not supported in this browser.');
      setIsCameraSupported(false);
    }
  }, [isCameraReady]);

  const capture = async () => {
    console.log('Capture button clicked');
    setIsProcessing(true);
    
    if (camera.current) {
      try {
        console.log('Camera ref exists, taking photo');
        // Simple capture without options
        const imageSrc = camera.current.takePhoto();
        console.log('Image captured:', typeof imageSrc, imageSrc ? imageSrc.substring(0, 30) + '...' : 'null');
        
        if (imageSrc) {
          onCapture(imageSrc);
        } else {
          console.error('Failed to capture image: No image source returned');
          alert('Failed to capture image. Please try again.');
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
        alert(`Error capturing photo: ${error.message}`);
      }
    } else {
      console.error('Camera ref is not available');
      alert('Camera is not initialized. Please reload the page.');
    }
    
    setIsProcessing(false);
  };

  const switchCamera = () => {
    if (camera.current) {
      camera.current.switchCamera();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('File loaded:', e.target.result ? e.target.result.substring(0, 30) + '...' : 'null');
        onCapture(e.target.result);
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('Error reading file. Please try another image.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to inspect camera object
  const debugCamera = () => {
    console.log('Camera ref details:', camera.current);
    console.log('Camera methods:', camera.current ? Object.getOwnPropertyNames(Object.getPrototypeOf(camera.current)) : 'No camera ref');
    setIsCameraReady(true); // Force enable the button
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {isCameraSupported ? (
        <>
          <div className="flex-grow relative">
            <Camera
              ref={camera}
              aspectRatio="cover"
              facingMode="environment"
              errorMessages={{
                noCameraAccessible: 'No camera device accessible',
                permissionDenied: 'Permission denied',
                switchCamera: 'Switch camera failed',
                canvas: 'Canvas error'
              }}
              onCameraReady={() => {
                console.log('Camera is ready callback fired');
                setIsCameraReady(true);
              }}
              onCameraError={(error) => {
                console.error('Camera error:', error);
                alert(`Camera error: ${error}`);
              }}
              numberOfCamerasCallback={(num) => {
                setNumberOfCameras(num);
                console.log(`Number of cameras: ${num}`);
                // If we detect cameras, assume camera is ready
                if (num > 0) setIsCameraReady(true);
              }}
            />
          </div>
          
          {/* Semi-transparent control bar with modern UI */}
          <div className="p-4 flex justify-between items-center bg-black bg-opacity-40 backdrop-blur-sm">
            {/* Close button with icon */}
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
              disabled={isProcessing}
              aria-label="Close camera"
            >
              <X size={24} />
            </button>
            
            {/* Capture button with camera icon */}
            <button
              onClick={capture}
              className={`${
                isCameraReady && !isProcessing 
                  ? 'bg-white text-black hover:bg-opacity-80' 
                  : 'bg-gray-600 text-gray-300'
              } p-5 rounded-full text-lg font-bold transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center`}
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CameraIcon size={32} />
              )}
            </button>
            
            <div className="flex space-x-3">
              {numberOfCameras > 1 && (
                <button
                  onClick={switchCamera}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
                  disabled={isProcessing}
                  aria-label="Switch camera"
                >
                  <RotateCcw size={24} />
                </button>
              )}
              
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
                disabled={isProcessing}
                aria-label="Upload image"
              >
                <Upload size={24} />
              </button>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Debug button only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={debugCamera}
              className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded text-xs"
            >
              Debug
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p>Camera not supported in this browser.</p>
          <p className="text-sm text-gray-400 mt-2">
            Please use a modern browser on a device with a camera.
          </p>
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 mt-4 flex items-center"
          >
            <X size={20} className="mr-2" />
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;