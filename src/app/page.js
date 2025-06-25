'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [frames , setFrames]  = useState([]);
  const [frame , setFrame]    = useState(null);

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
  }, [])
  
  return (
    <div className="container">
      <div className="row h-frame">
        {
          frames[0] && frames[0].frames.map((item , index) => (
            <div key={index} className="col-md-4" onClick={() => handleSetFrame(item.id)}>
              <div className={`item-frame ${item.id == frame ? 'active' : ''}`}>
                <img src={`/frames/${frames[0].theme}/${item.asset}`} className="w-100"/>
              </div>
            </div>
          ))
        }
      </div>
      <div class="button-rainbow">
        <button onClick={handleGoTakePicture}><span>AYO MULAI</span></button>
      </div>
    </div>
  );
}
