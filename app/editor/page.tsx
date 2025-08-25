"use client";

import dynamic from "next/dynamic";

const VideoEditor = dynamic(
  () => import("@/components/video-editor/VideoEditor"),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <main className="flex-1 overflow-hidden">
        <VideoEditor />
      </main>
    </div>
  );
}
