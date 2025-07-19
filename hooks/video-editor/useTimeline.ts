import { create } from "zustand";
import { Clip, AudioTrack } from "@/lib/video-editor/types";

interface TimelineState {
  clips: Clip[];
  audioTracks: AudioTrack[];
  initializeClips: (clips: Clip[]) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;
  updateClipTrim: (clipId: string, startTime: number, endTime: number) => void;
  restoreClipOriginalDuration: (id: string) => void;
  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  cutClip: (clipId: string, cutTime: number) => void;
  addAudioTrack: (audioTrack: AudioTrack) => void;
  removeAudioTrack: (audioId: string) => void;
  updateAudioTrack: (audioId: string, updates: Partial<AudioTrack>) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  clips: [],
  audioTracks: [],

  initializeClips: (clips) =>
    set({
      clips: clips.map((clip) => ({
        ...clip,
        originalDuration:
          clip.originalDuration || clip.endTime - clip.startTime,
      })),
    }),

  reorderClips: (oldIndex, newIndex) =>
    set((state) => {
      const newClips = [...state.clips];
      const [movedClip] = newClips.splice(oldIndex, 1);
      newClips.splice(newIndex, 0, movedClip);
      return { clips: newClips };
    }),

  updateClipTrim: (clipId, startTime, endTime) =>
    set((state) => ({
      clips: state.clips.map((clip) => {
        if (clip.id === clipId) {
          const originalDuration =
            clip.originalDuration || clip.endTime - clip.startTime;
          // Ensure trimming doesn't exceed original duration
          const validStartTime = Math.max(
            0,
            Math.min(startTime, originalDuration - 0.1)
          );
          const validEndTime = Math.max(
            validStartTime + 0.1,
            Math.min(endTime, originalDuration)
          );

          return {
            ...clip,
            startTime: validStartTime,
            endTime: validEndTime,
            duration: validEndTime - validStartTime,
            originalDuration: originalDuration,
          };
        }
        return clip;
      }),
    })),

  restoreClipOriginalDuration: (id) =>
    set((state) => ({
      clips: state.clips.map((clip) => {
        if (clip.id === id && clip.originalDuration) {
          return {
            ...clip,
            startTime: 0,
            endTime: clip.originalDuration,
            duration: clip.originalDuration,
          };
        }
        return clip;
      }),
    })),

  addClip: (clip) =>
    set((state) => ({
      clips: [
        ...state.clips,
        {
          ...clip,
          originalDuration:
            clip.originalDuration || clip.endTime - clip.startTime,
        },
      ],
    })),

  removeClip: (id) =>
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
    })),

  updateClip: (id, updates) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id
          ? {
              ...clip,
              ...updates,
              duration:
                updates.endTime && updates.startTime
                  ? updates.endTime - updates.startTime
                  : clip.duration,
            }
          : clip
      ),
    })),

  cutClip: (clipId, cutTime) =>
    set((state) => {
      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex === -1) return state;

      const originalClip = state.clips[clipIndex];

      // Calculate cut time relative to the clip's timeline
      const relativeTime = cutTime - originalClip.startTime;

      // Ensure cut time is within clip bounds
      if (
        relativeTime <= 0 ||
        relativeTime >= originalClip.endTime - originalClip.startTime
      ) {
        return state;
      }

      // Create two new clips from the cut
      const firstClip: Clip = {
        ...originalClip,
        id: `${originalClip.id}_part1_${Date.now()}`,
        endTime: originalClip.startTime + relativeTime,
        duration: relativeTime,
      };

      const secondClip: Clip = {
        ...originalClip,
        id: `${originalClip.id}_part2_${Date.now()}`,
        startTime: originalClip.startTime + relativeTime,
        duration: originalClip.endTime - originalClip.startTime - relativeTime,
      };

      // Replace the original clip with the two new clips
      const newClips = [...state.clips];
      newClips.splice(clipIndex, 1, firstClip, secondClip);

      return { clips: newClips };
    }),

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
