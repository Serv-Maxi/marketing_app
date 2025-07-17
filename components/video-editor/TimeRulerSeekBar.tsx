import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { generateTimeMarkers } from '@/lib/video-editor/utils';

interface TimeRulerSeekBarProps {
  duration: number;
  currentTime: number;
  zoom: number;
  onSeek: (time: number) => void;
}

const TimeRulerSeekBar: React.FC<TimeRulerSeekBarProps> = ({ 
  duration, 
  currentTime, 
  zoom, 
  onSeek 
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  
  // Generate time markers based on zoom level
  const markers = generateTimeMarkers(duration, zoom);
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    
    const rect = rulerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const clickedTime = offsetX / zoom;
    
    if (clickedTime >= 0 && clickedTime <= duration) {
      onSeek(clickedTime);
    }
  };

  return (
    <div 
      ref={rulerRef}
      className="relative h-8 border-b border-border cursor-pointer"
      onClick={handleSeek}
    >
      {/* Time markers */}
      {markers.map(time => (
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
      {zoom >= 100 && markers.map(time => {
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
      
      {/* Playhead */}
      <motion.div 
        className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
        style={{ 
          x: currentTime * zoom,
          height: '100%'
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="w-4 h-4 -ml-[7px] -mt-1 rounded-full bg-primary"></div>
      </motion.div>
      
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-primary/30"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      />
    </div>
  );
};

export default TimeRulerSeekBar;
