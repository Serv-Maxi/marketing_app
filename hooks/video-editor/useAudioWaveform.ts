"use client";
import { useState, useEffect, useCallback } from "react";

interface WaveformData {
  peaks: number[];
  duration: number;
}

export const useAudioWaveform = (audioSrc: string) => {
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWaveform = useCallback(async (src: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create audio context
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();

      // Fetch and decode audio
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Get audio data from the first channel
      const channelData = audioBuffer.getChannelData(0);
      const duration = audioBuffer.duration;

      // Generate peaks (reduce sample rate for visualization)
      const samplesPerPixel = Math.floor(channelData.length / 200); // 200 data points for waveform
      const peaks: number[] = [];

      for (let i = 0; i < channelData.length; i += samplesPerPixel) {
        let max = 0;
        for (
          let j = 0;
          j < samplesPerPixel && i + j < channelData.length;
          j++
        ) {
          const sample = Math.abs(channelData[i + j]);
          if (sample > max) {
            max = sample;
          }
        }
        peaks.push(max);
      }

      setWaveformData({ peaks, duration });

      // Clean up
      await audioContext.close();
    } catch (err) {
      console.error("Failed to generate waveform:", err);
      setError("Failed to generate waveform");

      // Fallback: generate mock waveform data
      const mockPeaks = Array.from(
        { length: 200 },
        () => Math.random() * 0.8 + 0.1
      );
      setWaveformData({ peaks: mockPeaks, duration: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (audioSrc) {
      generateWaveform(audioSrc);
    }
  }, [audioSrc, generateWaveform]);

  return { waveformData, isLoading, error };
};
