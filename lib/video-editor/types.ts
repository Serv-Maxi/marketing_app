export interface Clip {
  id: string;
  src: string;
  startTime: number;
  endTime: number;
  duration?: number; // Make duration optional
  title: string;
}

export interface AudioTrack {
  id: string;
  src: string;
  startTime: number;
  endTime: number;
  duration?: number;
  title: string;
  volume: number; // 0.0 to 1.0
}
