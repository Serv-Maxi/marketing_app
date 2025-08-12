"use client";
import ContentType, {
  ContentType as ContentTypeEnum,
} from "@/components/shared/content-type";
import { useForm } from "react-hook-form";
import { useState } from "react";

// Import components
import MainPromptSection from "./_components/MainPromptSection";
import VideoSettingsSection from "./_components/VideoSettingsSection";
import ImageSettingsSection from "./_components/ImageSettingsSection";
import BasicsSection from "./_components/BasicsSection";
import MarketingFocusSection from "./_components/MarketingFocusSection";
import StyleOptimizationSection from "./_components/StyleOptimizationSection";
import FoldersSection from "./_components/FoldersSection";
import SubmitButton from "./_components/SubmitButton";

interface FormData {
  contentType: ContentTypeEnum;
  mainPrompt: string;
  platforms: string[];
  targetAudience: string;
  campaignGoal: string;
  headline: boolean;
  valueProposition: string;
  uniqueSellingPoint: string;
  sellingFeatures: string;
  callToAction: string;
  includeEmojis: boolean;
  toneOfVoice: string;
  language: string;
  folder: string;
  // Video specific fields
  videoResolution: string;
  videoLength: string;
  captions: boolean;
  // Image specific fields
  imageResolution: string;
}

const HomePage = () => {
  const [selectedContentType, setSelectedContentType] =
    useState<ContentTypeEnum>("TEXT");
  const [isLoading, setIsLoading] = useState(false);

  const { control, register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      contentType: "TEXT",
      mainPrompt: "",
      platforms: [],
      targetAudience: "",
      campaignGoal: "",
      headline: false,
      valueProposition: "",
      uniqueSellingPoint: "",
      sellingFeatures: "",
      callToAction: "",
      includeEmojis: false,
      toneOfVoice: "",
      language: "",
      folder: "",
      // Video specific fields
      videoResolution: "",
      videoLength: "",
      captions: false,
      // Image specific fields
      imageResolution: "",
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedVideoResolution, setSelectedVideoResolution] =
    useState<string>("");
  const [selectedImageResolution, setSelectedImageResolution] =
    useState<string>("");

  const platforms = [
    { id: "facebook", name: "Facebook", icon: "/icons/folder-facebook.svg" },
    { id: "instagram", name: "Instagram", icon: "/icons/folder-instagram.svg" },
    { id: "linkedin", name: "LinkedIn", icon: "/icons/folder-linkedin.svg" },
    { id: "x", name: "X", icon: "/icons/folder-x.svg" },
    { id: "website", name: "Website", icon: "/icons/folder-website.svg" },
  ];

  const togglePlatform = (platformId: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((id) => id !== platformId)
      : [...selectedPlatforms, platformId];

    setSelectedPlatforms(updatedPlatforms);
    setValue("platforms", updatedPlatforms);
  };

  const handleContentTypeChange = (type: ContentTypeEnum) => {
    setSelectedContentType(type);
    setValue("contentType", type);
  };

  const toggleVideoResolution = (resolution: string) => {
    const newResolution =
      selectedVideoResolution === resolution ? "" : resolution;
    setSelectedVideoResolution(newResolution);
    setValue("videoResolution", newResolution);
  };

  const toggleImageResolution = (resolution: string) => {
    const newResolution =
      selectedImageResolution === resolution ? "" : resolution;
    setSelectedImageResolution(newResolution);
    setValue("imageResolution", newResolution);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    console.log("Form data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Handle successful submission (e.g., redirect to results page)
  };

  return (
    <div className="container mx-auto p-8 bg-background">
      <ContentType
        selectedType={selectedContentType}
        onTypeChange={handleContentTypeChange}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-[24px]">
        {/* Main Prompt Section */}
        <MainPromptSection register={register} />

        {/* Conditional Sections Based on Content Type */}
        {selectedContentType === "VIDEO" && (
          <VideoSettingsSection
            control={control}
            selectedVideoResolution={selectedVideoResolution}
            toggleVideoResolution={toggleVideoResolution}
          />
        )}

        {selectedContentType === "IMAGE" && (
          <ImageSettingsSection
            selectedImageResolution={selectedImageResolution}
            toggleImageResolution={toggleImageResolution}
          />
        )}

        {/* Basics Section */}
        <BasicsSection
          control={control}
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
        />

        {/* Marketing Focus Section */}
        <MarketingFocusSection register={register} />

        {/* Style & Optimization Section */}
        <StyleOptimizationSection control={control} />

        {/* Folders Section */}
        <FoldersSection control={control} />

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default HomePage;
