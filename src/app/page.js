'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [frames , setFrames]      = useState([]);
  const [frame , setFrame]        = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme]         = useState(0);

  const handleGetFrames = async () => {
      const response = await fetch('/api/getimage', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setFrames(data.data)
      } else {
        console.error('Failed to fetch frames:', response.status);
      }
  }

  const handleSetFrame = (frame_id) => {
    setFrame(frame_id)
  }

  const handleGoTakePicture = () => {
    window.location = `/frame/${frame}`
  }

  useEffect(() => {
    handleGetFrames()

    setTheme(localStorage.getItem('theme') ?? 0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleThreeFingerTouch = (e) => {
      if (e.touches && e.touches.length === 3) {
        setShowModal(true);
      }
    };

    window.addEventListener('touchstart', handleThreeFingerTouch);
    return () => window.removeEventListener('touchstart', handleThreeFingerTouch);
  }, []);
  
  return (
    <div className="container">
      <div className="row h-frame">
        {
          frames[theme] && frames[theme].frames.map((item , index) => (
            <div key={index} className="col-md-6" onClick={() => handleSetFrame(item.id)}>
              <div className={`item-frame ${item.id == frame ? 'active' : ''}`}>
                <img src={`/frames/${item.asset}`} className="w-100"/>
              </div>
            </div>
          ))
        }
      </div>
      <div class="button-rainbow">
        <button onClick={handleGoTakePicture}><span>AYO MULAI</span></button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <select
              className="form-control mb-3"
              value={theme}
              onChange={(e) => {
                setTheme(parseInt(e.target.value))
                localStorage.setItem('theme' , e.target.value)
              }}
            >
              {
                frames.map((item, index) => (
                  <option value={index} key={index}>{item.theme}</option>
                ))
              }
            </select>
            <button onClick={() => {
              setShowModal(false)
            }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
