import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = ({ onCapture, onClose }) => {
  const camera = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  useEffect(() => {
    // Check for MediaDevices API support
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('MediaDevices API supported.');
      setIsCameraSupported(true);
    } else {
      console.error('MediaDevices API is not supported in this browser.');
      setIsCameraSupported(false);
    }

    // Ensure the app is running in a secure context
    if (window.isSecureContext) {
      console.log('Secure context: HTTPS or localhost');
    } else {
      console.warn('Not a secure context. Camera may not work on mobile devices.');
    }
  }, []);

  const capture = async () => {
    console.log('Capture button clicked');
    if (camera.current) {
      try {
        // Ensure we use a method that guarantees capturing the current frame
        const imageSrc = await camera.current.takePhoto({
          quality: 1, // Highest quality
          cacheSuffix: Date.now() // Ensure unique image
        });
        
        console.log('Image captured:', imageSrc);

        // Additional validation to ensure image is captured
        if (imageSrc && imageSrc.photo) {
          onCapture(imageSrc.photo); // Use the photo property
        } else {
          console.error('Failed to capture image: No image source returned');
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    } else {
      console.error('Camera ref is not available');
    }
  };

  const switchCamera = () => {
    if (camera.current) {
      camera.current.switchCamera();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('File loaded:', e.target.result);
        onCapture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {isCameraSupported ? (
        <>
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
              console.log('Camera is ready');
              setIsCameraReady(true);
            }}
            onCameraError={(error) => {
              console.error('Camera error:', error);
            }}
            numberOfCamerasCallback={(num) => {
              setNumberOfCameras(num);
              console.log(`Number of cameras: ${num}`);
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-50">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <button
              onClick={capture}
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={!isCameraReady}
            >
              Capture
            </button>
            {numberOfCameras > 1 && (
              <button
                onClick={switchCamera}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Switch Camera
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload File
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p>Camera not supported in this browser.</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
