"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function VideoHero() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setShowVideo(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className="flex flex-col gap-[16px]">
        <h1 className="text-4xl md:text-5xl font-bold leading-[76px]">
          Write. Shoot. Design. <br /> All in&nbsp;
          <span className="bg-gradient-to-r from-[#9E2AB2] to-[#BF7AC6] text-transparent bg-clip-text">
            One Place.
          </span>
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300">
          AI-powered tools to generate engaging text, videos, and visuals for
          your brand. Just type your idea and let us do the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-[8px]">
          <Link href="/home">
            <Button className="rounded-[12px]">Create Now</Button>
          </Link>

          <Button
            variant="ghost"
            className="rounded-[12px] flex gap-2"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            AI-powered <Sparkles />
          </Button>
        </div>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-[#F6F8FA]">
        {!showVideo && (
          <>
            <Image
              src="/thumbnail.png"
              alt="Demo video"
              width={600}
              height={400}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={handlePlayVideo}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-6 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#9E2AB2]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </button>
          </>
        )}

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showVideo ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <video
            ref={videoRef}
            className="w-[535px] h-[350px] rounded-lg shadow-lg"
            controls
            playsInline
            poster="/thumbnail.png"
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
