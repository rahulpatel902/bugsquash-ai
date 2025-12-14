import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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
  title: "BugSquash AI - Intelligent Issue Resolver",
  description: "Automatically analyze GitHub issues and error logs, generate AI-powered fix PRs, and squash bugs faster than ever.",
  keywords: ["bug tracker", "AI", "GitHub", "code review", "developer tools", "automation"],
  authors: [{ name: "BugSquash Team" }],
  openGraph: {
    title: "BugSquash AI - Intelligent Issue Resolver",
    description: "Automatically analyze GitHub issues and generate fix PRs with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
