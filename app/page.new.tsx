import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoHero } from "@/components/landing/video-hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="40"
            viewBox="0 0 42 40"
            fill="none"
          >
            <circle cx="20" cy="20" r="20" fill="#9E2AB2" />
            <path
              d="M16.7557 15.7931C15.3593 23.0068 12.9139 34.2528 12.0321 38.4602C11.8536 39.3117 12.4398 40 13.3033 40H16.7557C17.4813 40 18.5096 39.367 18.6758 38.6552L20.456 31.3163C20.7966 29.8577 22.5033 29.9558 23.1264 31.3163L25.3928 35.9331C25.6483 36.4911 26.2025 36.8485 26.8124 36.8485H28.1199C28.633 36.8485 29.1134 36.5948 29.4055 36.1697L33.3626 31.097C34.1774 29.911 35.1429 29.8951 35.1429 31.3375C35.1429 32.4313 37.1174 33.1214 38.0882 32.6323L38.3965 32.4769C38.8404 32.2532 39.1526 31.8304 39.2377 31.3375L41.8187 16.2414C41.985 15.2776 41.3413 14 40.3706 14H38.7033C38.1331 14 37.1979 14.8413 36.9231 15.3448L30.2473 26.9716C29.6258 28.1104 27.3416 27.7369 26.8124 26.5517L21.7912 15.3448C21.5387 14.7794 20.7255 14 20.1103 14H18.5099C17.7575 14 16.8998 15.0489 16.7557 15.7931Z"
              fill="white"
            />
          </svg>
          <span className="font-semibold text-lg">Marketing Workflow</span>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <a
                href="#generate"
                className="hover:text-primary transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="hover:text-primary transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#why-use"
                className="hover:text-primary transition-colors"
              >
                Why Use
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-primary transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
        <Link href="/home">
          <Button variant="outline" className="rounded-[12px]">
            Sign in
          </Button>
        </Link>
      </header>

      <main>
        <VideoHero />

        {/* What You Can Generate */}
        <section
          id="generate"
          className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What You Can Generate
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <span className="text-[#9E2AB2]">
                  Bring your ideas to life{" "}
                </span>
                — in any format you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cards */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-[16px] flex flex-col gap-4 border-1 border-[#F2F4F3]">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/what-you-can-generate-text.png"
                    alt="Text Copy"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Text Copy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  From attention-grabbing captions to full blog posts — generate
                  content for LinkedIn, Instagram, Twitter, and beyond with just
                  one prompt.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-[16px] flex flex-col gap-4 border-1 border-[#F2F4F3]">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/what-you-can-generate-image.png"
                    alt="Short-Form Video"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Short-Form Video</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Turn your message into scroll-stopping Reels, Shorts, or
                  TikToks. Scripted and styled to grab attention in seconds.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-[16px] flex flex-col gap-4 border-1 border-[#F2F4F3]">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/what-you-can-generate-video.png"
                    alt="Image Posts"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Image Posts</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create eye-catching visuals, thumbnails, or banners that match
                  your message. No design skills needed — just your idea.
                </p>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* Why Use This Tool */}
        <section id="why-use" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Use This Tool
              </h2>
              <p className="text-lg">
                <span className="text-[#9E2AB2]">Built</span> to Supercharge
                Your Marketing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="dark:bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/Orgenize-you-creation.png"
                    alt="Organize your creation"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">
                  Organize your creation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Type anything — a topic, draft, or product description.
                </p>
              </div>

              <div className="dark:bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/Customize-tone-length-and-style.png"
                    alt="Customize tone, length, and style"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">
                  Customize tone, length, and style
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Type anything — a topic, draft, or product description.
                </p>
              </div>

              <div className="dark:bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
                <div className="h-fit mb-4 overflow-hidden rounded-md">
                  <Image
                    src="/images/Customize-tone-length-and-style.png"
                    alt="No need for editing tools"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">
                  No need for editing tools
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Type anything — a topic, draft, or product description.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#9E2AB2] text-white py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your Next Marketing Campaign?
            </h2>
            <p className="text-xl mb-8">
              Start generating content that gets clicks — in seconds.
            </p>
            <Link href="/home">
              <Button className="rounded-[12px] bg-white text-[#9E2AB2] hover:bg-gray-100">
                Create Now
              </Button>
            </Link>
          </div>
        </section>

        <FAQ />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="40"
                  viewBox="0 0 42 40"
                  fill="none"
                >
                  <circle cx="20" cy="20" r="20" fill="#9E2AB2" />
                  <path
                    d="M16.7557 15.7931C15.3593 23.0068 12.9139 34.2528 12.0321 38.4602C11.8536 39.3117 12.4398 40 13.3033 40H16.7557C17.4813 40 18.5096 39.367 18.6758 38.6552L20.456 31.3163C20.7966 29.8577 22.5033 29.9558 23.1264 31.3163L25.3928 35.9331C25.6483 36.4911 26.2025 36.8485 26.8124 36.8485H28.1199C28.633 36.8485 29.1134 36.5948 29.4055 36.1697L33.3626 31.097C34.1774 29.911 35.1429 29.8951 35.1429 31.3375C35.1429 32.4313 37.1174 33.1214 38.0882 32.6323L38.3965 32.4769C38.8404 32.2532 39.1526 31.8304 39.2377 31.3375L41.8187 16.2414C41.985 15.2776 41.3413 14 40.3706 14H38.7033C38.1331 14 37.1979 14.8413 36.9231 15.3448L30.2473 26.9716C29.6258 28.1104 27.3416 27.7369 26.8124 26.5517L21.7912 15.3448C21.5387 14.7794 20.7255 14 20.1103 14H18.5099C17.7575 14 16.8998 15.0489 16.7557 15.7931Z"
                    fill="white"
                  />
                </svg>
                <span className="font-semibold text-lg">
                  Marketing Workflow
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-md text-center">
                Streamlining marketing workflows with AI-powered content
                creation tools that help brands create engaging content faster
                than ever before.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© 2025 Marketing Workflow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
