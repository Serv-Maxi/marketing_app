// Server-side auth gate for /home route using Supabase SSR helper

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Global template currently wraps all routes at app/ root. We only want to gate
// Root template intentionally left without auth gating.
export default function RootTemplate({ children }: AuthWrapperProps) {
  return <>{children}</>;
}
