"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePlatforms } from "@/hooks/usePlatforms";
import { FormData as FormType } from "@/types/form";
import AuthWrapper from "@/components/auth/AuthWrapper";

// Import components
import MainPromptSection from "./_components/MainPromptSection";
import BasicsSection from "./_components/BasicsSection";
import MarketingFocusSection from "./_components/MarketingFocusSection";
import StyleOptimizationSection from "./_components/StyleOptimizationSection";
import FoldersSection from "./_components/FoldersSection";
import { Button } from "@/components/ui/button";
import AspectRatio from "./_components/VideoSettingsSection";
import { Task, TasksService } from "@/services/database";
import { ContentType } from "@/types/global";
import ContentTypeComponent from "@/components/shared/content-type";
import { useSearchParams, useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type") as ContentType | null;
  const folderFromUrl = searchParams.get("folder") as string | null;

  const [selectedContentType, setSelectedContentType] =
    useState<ContentType>("Text");
  const { platforms, isLoading: platformsLoading } = usePlatforms();

  const { control, register, handleSubmit, setValue } = useForm<FormType>({
    defaultValues: {
      type: "Text",
      prompt: "",
      platforms: [],
      audience: "",
      campaign_goal: "",
      value_proposition: "",
      selling_point: "",
      selling_features: "",
      cta: "",
      use_emoji: false,
      tone: "",
      language: "",
      folder_id: folderFromUrl || "",
      aspect_ratio: "",
    },
  });

  type StateStatus<T> = {
    status: "idle" | "loading" | "success" | "error";
    data: Array<T>;
    error: string;
  };

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectRatio, setSelectRatio] = useState<string>("");
  const [creationState, setCreationState] = useState<StateStatus<Task>>({
    status: "idle",
    data: [],
    error: "",
  });

  const togglePlatform = (platformSlug: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformSlug)
      ? selectedPlatforms.filter((slug) => slug !== platformSlug)
      : [...selectedPlatforms, platformSlug];

    setSelectedPlatforms(updatedPlatforms);
    setValue("platforms", updatedPlatforms);
  };

  const handleContentTypeChange = (type: ContentType) => {
    setSelectedContentType(type);
    setValue("type", type);
  };

  const toogleAspectRatio = (resolution: string) => {
    const newResolution = selectRatio === resolution ? "" : resolution;
    setSelectRatio(newResolution);
    setValue("aspect_ratio", newResolution);
  };

  const onSubmit = async (data: FormType) => {
    setCreationState({ status: "loading", data: [], error: "" });

    try {
      const payload = data;
      delete payload?.aspect_ratio;

      const creation: Task[] = await TasksService.createTask([
        {
          ...payload,
          status: "On Queue",
          company_id: process.env.NEXT_PUBLIC_COMPANY_ID as string,
        },
      ]);

      if (creation) {
        setCreationState({
          status: "success",
          data: creation,
          error: "",
        });

        router.push(`/creation/process/${creation[0].id}`);
      }
    } catch (error) {
      setCreationState({
        status: "error",
        data: [],
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      // Don't reset state immediately - let the real-time updates handle it
      // setCreationState({ status: "idle", data: null });
    }
  };
  useEffect(() => {
    if (typeFromUrl) {
      setSelectedContentType(typeFromUrl);
    }
  }, [typeFromUrl]);

  // Show error state
  if (creationState.status === "error") {
    return (
      <div className="container mx-auto p-8 bg-background">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mt-20">
          <h2 className="text-red-800 font-semibold mb-2">
            Error Creating Task
          </h2>
          <p className="text-red-600 text-sm">
            {creationState.error as string}
          </p>
          <Button
            onClick={() =>
              setCreationState({ status: "idle", error: "", data: [] })
            }
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  console.log(selectedContentType);
  return (
    <div className="container mx-auto p-8 bg-background">
      <ContentTypeComponent
        selectedType={selectedContentType}
        onTypeChange={handleContentTypeChange}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-[24px]">
        <MainPromptSection register={register} />

        {selectedContentType !== "Text" && (
          <AspectRatio
            selectRatio={selectRatio}
            toogleAspectRatio={toogleAspectRatio}
          />
        )}

        <BasicsSection
          control={control}
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
          isLoading={platformsLoading}
        />

        <MarketingFocusSection register={register} />

        <StyleOptimizationSection control={control} />

        <FoldersSection control={control} />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={creationState.status === "loading"}
            className="text-secondary-foreground px-8 py-3 rounded-[12px]"
          >
            {creationState.status === "loading"
              ? "Submitting..."
              : "Create Content"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const WrappedHomePage = () => {
  return (
    <AuthWrapper>
      <HomePage />
    </AuthWrapper>
  );
};

export default WrappedHomePage;
