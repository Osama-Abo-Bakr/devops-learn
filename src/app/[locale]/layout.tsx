import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StreakXPBar from "@/components/progress/StreakXPBar";
import { ProgressProvider } from "@/context/ProgressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AiChat = dynamic(() => import("@/components/chat/AiChat"));

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <ProgressProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <StreakXPBar />
            <main className="flex flex-1">{children}</main>
            <Footer />
            <AiChat />
          </div>
        </ProgressProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}