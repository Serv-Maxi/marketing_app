import { create } from 'zustand';
import { Clip } from '@/lib/video-editor/types';

interface TimelineState {
  clips: Clip[];
  initializeClips: (clips: Clip[]) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;
  updateClipTrim: (clipId: string, startTime: number, endTime: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  clips: [],
  
  initializeClips: (clips) => set({ clips }),
  
  reorderClips: (oldIndex, newIndex) => 
    set((state) => {
      const newClips = [...state.clips];
      const [movedClip] = newClips.splice(oldIndex, 1);
      newClips.splice(newIndex, 0, movedClip);
      return { clips: newClips };
    }),
  
  updateClipTrim: (clipId, startTime, endTime) =>
    set((state) => ({
      clips: state.clips.map(clip => 
        clip.id === clipId 
          ? { ...clip, startTime, endTime } 
          : clip
      )
    })),
}));
