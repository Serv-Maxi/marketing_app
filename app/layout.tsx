import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Using Inter as it's the closest to MD Sans design principles
const dmsans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Marketing Workflow",
  description: "Marketing workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmsans.variable} font-sans antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
