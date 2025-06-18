"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function PhotoPage() {
  const videoRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Get the user's webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Set the stream to the video element
        }
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });

    return () => {
      // Clean up the stream when the component is unmounted
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // Stop all tracks to release the webcam
        }
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      // Set canvas size to the video size
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');
      setImageUrl(dataUrl);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'webcam-photo.png'; // Set the filename
      link.click(); // Trigger the download
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '550px', height: '70vh', overflow: 'hidden', borderRadius: '50%' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div>
        <button onClick={capturePhoto} style={{ margin: '10px' }}>Capture Photo</button>
        {imageUrl && (
          <div>
            <button onClick={downloadImage} style={{ margin: '10px' }}>Download Photo</button>
            <img
              src={imageUrl}
              alt="Captured"
              style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', marginTop: '20px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
