"use client";
import VideoEditor from "@/components/video-editor/VideoEditor";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-hidden">
        <VideoEditor />
      </main>
    </div>
  );
}
