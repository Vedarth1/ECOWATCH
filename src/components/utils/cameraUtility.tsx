import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = ({ onCapture, onClose }) => {
  const camera = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    console.log('Camera ready state:', isCameraReady);
  }, [isCameraReady]);

  const capture = () => {
    console.log('Capture button clicked');
    if (camera.current) {
      const imageSrc = camera.current.takePhoto();
      console.log('Image captured:', imageSrc);
      onCapture(imageSrc);
    } else {
      console.error('Camera ref is not available');
    }
  };

  const handleFileChange = (event: { target: { files: unknown[]; }; }) => {
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
      <Camera
        ref={camera}
        aspectRatio="cover"
        facingMode="environment"
        onCameraReady={() => {
          console.log('Camera is ready');
          setIsCameraReady(true);
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
        >
          Capture
        </button>
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
    </div>
  );
};

export default CameraComponent;