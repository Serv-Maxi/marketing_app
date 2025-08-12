import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const StartCreation = () => {
  const router = useRouter();
  return (
    <Card className="shadow-none overflow-hidden bg-primary">
      <CardContent className="p-[38px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[100px] items-center">
          {/* First Column - Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4 text-white">
                Create your <br /> marketing workflow right now!
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-white">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour,
              </p>
            </div>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3"
              onClick={() => router.push("/creation/new")}
            >
              Generate Now
            </Button>
          </div>

          {/* Second Column - 2x2 Card Grid */}
          <div className="grid grid-cols-2 gap-4 translate-y-12">
            {/* First Row */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <CardTitle className="text-base">Video Editing</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>Professional timeline editor</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow transform">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-base">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>Smart editing suggestions</CardDescription>
              </CardContent>
            </Card>

            {/* Second Row */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <CardTitle className="text-base">Audio Tracks</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>Waveform visualization</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow transform">
              <CardHeader className="pb-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <CardTitle className="text-base">Export</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>High-quality output</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
