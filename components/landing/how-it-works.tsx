"use client";

import { useState } from "react";
import Image from "next/image";

const howItWorksSteps = [
  {
    icon: "/ide.svg",
    title: "Write or paste your idea",
    description: "Type anything — a topic, draft, or product description.",
    image: "/images/Write-or-paste-your-idea.png",
  },
  {
    icon: "/click.svg",
    title: "Choose what to generate",
    description: "Select from text, video, or image formats.",
    image: "/images/Choose-what-to-generate.png",
  },
  {
    icon: "/download.svg",
    title: "Get publish-ready content",
    description: "Instantly generate editable, high-quality marketing content.",
    image: "/images/download-content.png",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-[16px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg">
            <span className="text-[#9E2AB2]">
              From idea to ready-to-publish content
            </span>{" "}
            — in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <Image
              src={howItWorksSteps[activeStep].image}
              alt={`Step ${activeStep + 1}: ${howItWorksSteps[activeStep].title}`}
              width={500}
              height={400}
              className="transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-6">
            {howItWorksSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex items-start gap-4 p-4 rounded-lg text-left transition-colors cursor-pointer ${
                  activeStep === index ? "bg-[#F6F8FA]" : "hover:bg-[#F6F8FA]"
                }`}
              >
                <div>
                  <Image
                    src={step.icon}
                    alt={`Step ${activeStep + 1}: ${howItWorksSteps[activeStep].title}`}
                    width={24}
                    height={24}
                    className="transition-all duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
