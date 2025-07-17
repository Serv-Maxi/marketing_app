export interface Clip {
  id: string;
  src: string;
  startTime: number;
  endTime: number;
  duration?: number; // Make duration optional
  title: string;
}
