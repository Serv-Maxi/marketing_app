// Server-side auth gate for /home route using Supabase SSR helper
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ConditionalHeader from "@/components/shared/conditional-header";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default async function HomeTemplate({ children }: AuthWrapperProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/signin");
  return (
    <>
      <ConditionalHeader />
      <main className="pt-[100px]">{children}</main>
    </>
  );
}
