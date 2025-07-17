import React from 'react';
import { motion } from 'framer-motion';

interface PlayheadProps {
  currentTime: number;
  zoom: number;
}

const Playhead: React.FC<PlayheadProps> = ({ currentTime, zoom }) => {
  return (
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
  );
};

export default Playhead;
