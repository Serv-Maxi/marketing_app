"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Optionally redirect to sign in or wait for email confirmation
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] p-4">
        <Card className="w-full max-w-md bg-white rounded-[24px] shadow-none border-0">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-[16px] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Created!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please check your email to verify your account. You&apos;ll be
              redirected to sign in shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] p-4">
      <Card className="w-full max-w-md bg-white rounded-[24px] shadow-none border-0">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-[#9E2AB2] rounded-[16px] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join us to start creating amazing marketing content
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="rounded-[12px] border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="rounded-[12px] border-gray-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="rounded-[12px] border-gray-200"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9E2AB2] hover:bg-[#8A1F99] text-white rounded-[12px] h-11"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="space-y-4">
            <Separator />

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[#9E2AB2] hover:text-[#8A1F99] font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
