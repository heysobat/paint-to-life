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

  const capturePhoto = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const size = Math.min(video.videoWidth, video.videoHeight); // bikin kotak dari tengah
      canvas.width = size;
      canvas.height = size;

      // Buat lingkaran clipping path
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      // Gambar dari tengah (biar bulatnya pas)
      const offsetX = (video.videoWidth - size) / 2;
      const offsetY = (video.videoHeight - size) / 2;
      context.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/png');
      if (!dataUrl) return;

      const response = await fetch('/api/saveimage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: dataUrl }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Image saved at:', result.url);
        alert('Image saved to server!');
      } else {
        alert('Failed to save image');
      }
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
