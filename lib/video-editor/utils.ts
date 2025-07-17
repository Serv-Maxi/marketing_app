/**
 * Format time in seconds to a readable format (MM:SS.ms)
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor((time % 1) * 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
};

/**
 * Calculate the total duration of all clips
 */
export const calculateTotalDuration = (clips: { startTime: number; endTime: number }[]): number => {
  return clips.reduce((total, clip) => total + (clip.endTime - clip.startTime), 0);
};

/**
 * Generate time markers based on zoom level and duration
 */
export const generateTimeMarkers = (duration: number, zoom: number): number[] => {
  const markers = [];
  const step = zoom >= 200 ? 1 : zoom >= 100 ? 5 : 10; // Adjust marker density based on zoom
  
  for (let i = 0; i <= Math.ceil(duration); i += step) {
    markers.push(i);
  }
  
  return markers;
};

/**
 * Find which clip is currently playing based on the overall timeline position
 */
export const findCurrentClip = (
  time: number, 
  clips: { id: string; startTime: number; endTime: number }[]
) => {
  let accumulatedTime = 0;
  
  for (const clip of clips) {
    const clipDuration = clip.endTime - clip.startTime;
    if (time < accumulatedTime + clipDuration) {
      return {
        clip,
        clipStartTime: accumulatedTime,
        clipRelativeTime: time - accumulatedTime + clip.startTime
      };
    }
    accumulatedTime += clipDuration;
  }
  
  // If we're past the end, return the last clip
  if (clips.length > 0) {
    const lastClip = clips[clips.length - 1];
    return {
      clip: lastClip,
      clipStartTime: accumulatedTime - (lastClip.endTime - lastClip.startTime),
      clipRelativeTime: lastClip.endTime
    };
  }
  
  return null;
};
