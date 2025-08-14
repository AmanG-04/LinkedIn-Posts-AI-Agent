import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedIn Posts AI Agent",
  description: "AI-powered LinkedIn content creation and management system",
  keywords: ["LinkedIn", "AI", "Content Creation", "Social Media", "Automation"],
  authors: [{ name: "Your Name" }],
  // viewport removed; handled in page.tsx as per Next.js 15
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
}
