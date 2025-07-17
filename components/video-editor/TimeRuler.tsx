import React from 'react';

interface TimeRulerProps {
  duration: number;
  zoom: number;
}

const TimeRuler: React.FC<TimeRulerProps> = ({ duration, zoom }) => {
  // Generate time markers based on zoom level
  const getMarkers = () => {
    const markers = [];
    const step = zoom >= 200 ? 1 : zoom >= 100 ? 5 : 10; // Adjust marker density based on zoom
    
    for (let i = 0; i <= Math.ceil(duration); i += step) {
      markers.push(i);
    }
    
    return markers;
  };

  return (
    <div className="relative h-8 border-b border-border">
      {getMarkers().map(time => (
        <div 
          key={time} 
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${time * zoom}px` }}
        >
          <div className="h-3 w-0.5 bg-muted-foreground"></div>
          <span className="text-xs text-muted-foreground mt-1">{time}</span>
        </div>
      ))}
      
      {/* Smaller tick marks */}
      {zoom >= 100 && getMarkers().map(time => {
        if (time + 0.5 <= duration) {
          return (
            <div 
              key={`${time}-half`} 
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(time + 0.5) * zoom}px` }}
            >
              <div className="h-2 w-0.5 bg-muted-foreground/50"></div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default TimeRuler;
