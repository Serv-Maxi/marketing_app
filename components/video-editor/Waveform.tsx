"use client";
import React from "react";

interface WaveformProps {
  peaks: number[];
  width: number;
  height: number;
  startTime: number;
  endTime: number;
  duration: number;
  color?: string;
  backgroundColor?: string;
}

const Waveform: React.FC<WaveformProps> = ({
  peaks,
  width,
  height,
  startTime,
  endTime,
  duration,
  color = "#f97316",
  backgroundColor = "rgba(249, 115, 22, 0.2)",
}) => {
  if (!peaks || peaks.length === 0) {
    // Show loading bars or placeholder
    return (
      <div className="flex items-center h-full gap-0.5">
        {Array.from({ length: Math.floor(width / 3) }, (_, i) => (
          <div
            key={i}
            className="bg-orange-400/40 animate-pulse"
            style={{
              width: "2px",
              height: `${Math.random() * 60 + 20}%`,
            }}
          />
        ))}
      </div>
    );
  }

  // Calculate which portion of the waveform to show based on trim
  const totalDuration = duration || endTime - startTime;
  const trimStartRatio = startTime / totalDuration;
  const trimEndRatio = endTime / totalDuration;

  // Ensure ratios are valid
  const safeStartRatio = Math.max(0, Math.min(1, trimStartRatio));
  const safeEndRatio = Math.max(safeStartRatio, Math.min(1, trimEndRatio));

  const startIndex = Math.floor(safeStartRatio * peaks.length);
  const endIndex = Math.ceil(safeEndRatio * peaks.length);
  const visiblePeaks = peaks.slice(startIndex, endIndex);

  // Calculate bar width based on available space
  const barCount = Math.min(visiblePeaks.length, Math.floor(width / 2));
  const barWidth = Math.max(1, Math.floor(width / barCount) - 1);
  const spacing = 1;

  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ width, height, backgroundColor }}
    >
      <div className="flex items-center h-full gap-0.5">
        {Array.from({ length: barCount }, (_, i) => {
          const peakIndex = Math.floor((i / barCount) * visiblePeaks.length);
          const peak = visiblePeaks[peakIndex] || 0;
          const barHeight = Math.max(2, peak * height * 0.8);

          return (
            <div
              key={i}
              style={{
                width: `${barWidth}px`,
                height: `${barHeight}px`,
                backgroundColor: color,
                marginRight: `${spacing}px`,
              }}
              className="rounded-sm"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Waveform;
