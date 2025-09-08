"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqLists = [
  {
    question: "What types of content can I generate with this workflow?",
    answer:
      "You can generate images, text, and videos. Each type of content can be customized, edited, and downloaded directly.",
  },
  {
    question: "Can I edit the generated text?",
    answer:
      "Yes, you can copy, edit, and regenerate text as many times as needed until it fits your campaign requirements.",
  },
  {
    question: "How do I organize my generated content?",
    answer:
      "You can organize content using folders. This helps keep your projects, campaigns, and assets structured and easy to access.",
  },
  {
    question: "Is it possible to edit or customize generated videos?",
    answer:
      "Yes, you can edit videos directly within the system or download them for external editing if needed.",
  },
  {
    question: "Can I download my generated images and videos?",
    answer:
      "Absolutely. Once generated, both images and videos can be downloaded for use across different platforms.",
  },
  {
    question: "Do I need to set campaign details before generating content?",
    answer:
      "Yes. You can define target audience, campaign goals, tone of voice, features, USP (Unique Selling Proposition), and preferred platforms before generating content for better results.",
  },
  {
    question: "What platforms can I prepare content for?",
    answer:
      "The workflow supports multiple platforms, including social media channels, websites, and ads. You can select specific platforms during campaign setup.",
  },
  {
    question: "Can I reuse content across multiple campaigns?",
    answer:
      "Yes, generated content can be organized into folders and reused for different campaigns or audiences.",
  },
  {
    question: "Does the system help maintain brand tone of voice?",
    answer:
      "Yes. You can set the tone of voice in campaign settings, and the system will generate text that matches your brand's communication style.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg mb-6">
            Do you have questions left unanswered?{" "}
            <a href="#" className="text-[#9E2AB2]">
              Contact us
            </a>
          </p>
        </div>

        <div>
          <Accordion type="single" collapsible className="w-full">
            {faqLists.map((elm, i) => (
              <AccordionItem
                key={i}
                className="bg-primary rounded-[8px] mb-2"
                value={elm.question}
              >
                <AccordionTrigger className="px-[16px] text-white">
                  {elm.question}
                </AccordionTrigger>
                <AccordionContent className="text-white px-[16px]">
                  {elm.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
