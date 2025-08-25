import { create } from "zustand";
import { Clip, AudioTrack } from "@/lib/video-editor/types";

interface SelectedCutState {
  clipId?: string;
  audioId?: string;
  time: number;
  kind: "clip" | "audio";
}

interface TimelineState {
  clips: Clip[];
  audioTracks: AudioTrack[];
  selectedCut: SelectedCutState | null;
  initializeClips: (clips: Clip[]) => void;
  reorderClips: (oldIndex: number, newIndex: number) => void;
  updateClipTrim: (clipId: string, startTime: number, endTime: number) => void;
  restoreClipOriginalDuration: (id: string) => void;
  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  cutClip: (clipId: string, cutTime: number) => void;
  duplicateClip: (clipId: string) => void;
  setCutSelection: (id: string, time: number, kind?: "clip" | "audio") => void;
  clearCutSelection: () => void;
  executeCutSelection: () => void;
  addAudioTrack: (audioTrack: AudioTrack) => void;
  removeAudioTrack: (audioId: string) => void;
  updateAudioTrack: (audioId: string, updates: Partial<AudioTrack>) => void;
  updateAudioTrim: (
    audioId: string,
    startTime: number,
    endTime: number
  ) => void;
  restoreAudioOriginalDuration: (id: string) => void;
  cutAudioTrack: (audioId: string, cutTime: number) => void;
  duplicateAudioTrack: (audioId: string) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  clips: [],
  audioTracks: [],
  selectedCut: null,

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

  setCutSelection: (id, time, kind = "clip") =>
    set(() =>
      kind === "clip"
        ? { selectedCut: { clipId: id, time, kind } }
        : { selectedCut: { audioId: id, time, kind } }
    ),
  clearCutSelection: () => set(() => ({ selectedCut: null })),
  executeCutSelection: () =>
    set((state) => {
      if (!state.selectedCut) return state;
      const { kind, time, clipId, audioId } = state.selectedCut;
      if (kind === "clip" && clipId) {
        const clipIndex = state.clips.findIndex((c) => c.id === clipId);
        if (clipIndex === -1) return { ...state, selectedCut: null };
        const originalClip = state.clips[clipIndex];
        const relativeTime = time - originalClip.startTime;
        if (
          relativeTime <= 0 ||
          relativeTime >= originalClip.endTime - originalClip.startTime
        ) {
          return { ...state, selectedCut: null };
        }
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
          duration:
            originalClip.endTime - originalClip.startTime - relativeTime,
        };
        const newClips = [...state.clips];
        newClips.splice(clipIndex, 1, firstClip, secondClip);
        return { clips: newClips, selectedCut: null };
      } else if (kind === "audio" && audioId) {
        const trackIndex = state.audioTracks.findIndex((t) => t.id === audioId);
        if (trackIndex === -1) return { ...state, selectedCut: null };
        const originalTrack = state.audioTracks[trackIndex];
        const relativeTime = time - originalTrack.startTime;
        if (
          relativeTime <= 0 ||
          relativeTime >= originalTrack.endTime - originalTrack.startTime
        ) {
          return { ...state, selectedCut: null };
        }
        const firstTrack: AudioTrack = {
          ...originalTrack,
          id: `${originalTrack.id}_part1_${Date.now()}`,
          endTime: originalTrack.startTime + relativeTime,
          duration: relativeTime,
        };
        const secondTrack: AudioTrack = {
          ...originalTrack,
          id: `${originalTrack.id}_part2_${Date.now()}`,
          startTime: originalTrack.startTime + relativeTime,
          duration:
            originalTrack.endTime - originalTrack.startTime - relativeTime,
        };
        const newAudioTracks = [...state.audioTracks];
        newAudioTracks.splice(trackIndex, 1, firstTrack, secondTrack);
        return { audioTracks: newAudioTracks, selectedCut: null };
      }
      return { ...state, selectedCut: null };
    }),

  duplicateClip: (clipId) =>
    set((state) => {
      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex === -1) return state;

      const originalClip = state.clips[clipIndex];

      // Generate a better name for the duplicate
      const timestamp = Date.now();
      const duplicatedClip: Clip = {
        ...originalClip,
        id: `${originalClip.id}_duplicate_${timestamp}`,
      };

      // Insert the duplicated clip right after the original clip
      const newClips = [...state.clips];
      newClips.splice(clipIndex + 1, 0, duplicatedClip);

      return { clips: newClips };
    }),

  addAudioTrack: (audioTrack) =>
    set((state) => ({
      audioTracks: [
        ...state.audioTracks,
        {
          ...audioTrack,
          originalDuration:
            audioTrack.originalDuration ||
            audioTrack.endTime - audioTrack.startTime,
        },
      ],
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

  updateAudioTrim: (audioId, startTime, endTime) =>
    set((state) => ({
      audioTracks: state.audioTracks.map((track) => {
        if (track.id === audioId) {
          const originalDuration =
            track.originalDuration || track.endTime - track.startTime;
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
            ...track,
            startTime: validStartTime,
            endTime: validEndTime,
            duration: validEndTime - validStartTime,
            originalDuration: originalDuration,
          };
        }
        return track;
      }),
    })),

  restoreAudioOriginalDuration: (id) =>
    set((state) => ({
      audioTracks: state.audioTracks.map((track) => {
        if (track.id === id && track.originalDuration) {
          return {
            ...track,
            startTime: 0,
            endTime: track.originalDuration,
            duration: track.originalDuration,
          };
        }
        return track;
      }),
    })),

  cutAudioTrack: (audioId, cutTime) =>
    set((state) => {
      const trackIndex = state.audioTracks.findIndex(
        (track) => track.id === audioId
      );
      if (trackIndex === -1) return state;

      const originalTrack = state.audioTracks[trackIndex];

      // Calculate cut time relative to the track's timeline
      const relativeTime = cutTime - originalTrack.startTime;

      // Ensure cut time is within track bounds
      if (
        relativeTime <= 0 ||
        relativeTime >= originalTrack.endTime - originalTrack.startTime
      ) {
        return state;
      }

      // Create two new tracks from the cut
      const firstTrack: AudioTrack = {
        ...originalTrack,
        id: `${originalTrack.id}_part1_${Date.now()}`,
        endTime: originalTrack.startTime + relativeTime,
        duration: relativeTime,
      };

      const secondTrack: AudioTrack = {
        ...originalTrack,
        id: `${originalTrack.id}_part2_${Date.now()}`,
        startTime: originalTrack.startTime + relativeTime,
        duration:
          originalTrack.endTime - originalTrack.startTime - relativeTime,
      };

      // Replace the original track with the two new tracks
      const newAudioTracks = [...state.audioTracks];
      newAudioTracks.splice(trackIndex, 1, firstTrack, secondTrack);

      return { audioTracks: newAudioTracks };
    }),

  duplicateAudioTrack: (audioId) =>
    set((state) => {
      const trackIndex = state.audioTracks.findIndex(
        (track) => track.id === audioId
      );
      if (trackIndex === -1) return state;

      const originalTrack = state.audioTracks[trackIndex];

      // Generate a better name for the duplicate
      const timestamp = Date.now();
      const duplicatedTrack: AudioTrack = {
        ...originalTrack,
        id: `${originalTrack.id}_duplicate_${timestamp}`,
        title: `${originalTrack.title} (Copy)`,
      };

      // Insert the duplicated track right after the original track
      const newAudioTracks = [...state.audioTracks];
      newAudioTracks.splice(trackIndex + 1, 0, duplicatedTrack);

      return { audioTracks: newAudioTracks };
    }),
}));
