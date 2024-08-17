import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Update progress every 20ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <video className="background-video" autoPlay loop muted>
        <source src="./assets/vids/zero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="loading-content">
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
