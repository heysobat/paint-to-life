"use client";
import React, { useEffect, useRef } from 'react';

export default function PhotoPage() {
  const videoRef = useRef(null);

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

  return (
    <div style={{ display: 'flex', justifyContent: 'center' , alignItems : 'center' , height: '100vh',  }}>
        <div style={{ width: '550px', height: '70vh', overflow: 'hidden', borderRadius: '50%' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    </div>
  );
}
