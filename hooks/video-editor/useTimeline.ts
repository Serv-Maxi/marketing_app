import { create } from "zustand";
import { Clip, AudioTrack } from "@/lib/video-editor/types";

interface TimelineState {
  clips: Clip[];
  audioTracks: AudioTrack[];
  initializeClips: (clips: Clip[]) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;
  updateClipTrim: (clipId: string, startTime: number, endTime: number) => void;
  addAudioTrack: (audioTrack: AudioTrack) => void;
  removeAudioTrack: (audioId: string) => void;
  updateAudioTrack: (audioId: string, updates: Partial<AudioTrack>) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  clips: [],
  audioTracks: [],

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
      clips: state.clips.map((clip) =>
        clip.id === clipId ? { ...clip, startTime, endTime } : clip
      ),
    })),

  addAudioTrack: (audioTrack) =>
    set((state) => ({
      audioTracks: [...state.audioTracks, audioTrack],
    })),

  removeAudioTrack: (audioId) =>
    set((state) => ({
      audioTracks: state.audioTracks.filter((track) => track.id !== audioId),
    })),

  updateAudioTrack: (audioId, updates) =>
    set((state) => ({
      audioTracks: state.audioTracks.map((track) =>
        track.id === audioId ? { ...track, ...updates } : track
      ),
    })),
}));
