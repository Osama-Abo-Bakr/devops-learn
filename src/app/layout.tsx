import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: {
    default: "DevOps Learn — Visual Learning Platform",
    template: "%s | DevOps Learn",
  },
  description:
    "Free, visual learning platform for Docker, Kubernetes, and Docker Compose. Interactive diagrams, simulated terminals, and quizzes.",
  keywords: [
    "Docker",
    "Kubernetes",
    "Docker Compose",
    "DevOps",
    "containerization",
    "learning",
    "interactive",
    "visual",
  ],
  openGraph: {
    title: "DevOps Learn — Visual Learning Platform",
    description:
      "Master Docker, Kubernetes, and Docker Compose through interactive diagrams and terminal challenges.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}