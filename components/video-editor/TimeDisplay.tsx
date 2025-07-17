import React from 'react';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  // Format time as MM:SS.ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  return (
    <div className="text-sm font-mono">
      <span>{formatTime(currentTime)}</span>
      <span className="text-muted-foreground mx-1">/</span>
      <span className="text-muted-foreground">{formatTime(duration)}</span>
    </div>
  );
};

export default TimeDisplay;
