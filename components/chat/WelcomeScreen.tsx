import { Button } from "@/components/ui/button";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-8">
      <h1 className="text-3xl font-bold tracking-tight text-center">Welcome to Your AI Assistant</h1>
      <p className="text-center text-muted-foreground max-w-md">
        Ask anything, generate content, brainstorm, or get help with your tasks. Powered by Windsurf AI.
      </p>
      <Button size="lg" onClick={onStart}>
        Start a new conversation
      </Button>
    </div>
  );
}
