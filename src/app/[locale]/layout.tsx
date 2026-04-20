import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StreakXPBar from "@/components/progress/StreakXPBar";
import { ProgressProvider } from "@/context/ProgressContext";

const AiChat = dynamic(() => import("@/components/chat/AiChat"));

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <StreakXPBar />
        <main className="flex flex-1">{children}</main>
        <Footer />
        <AiChat />
      </div>
    </ProgressProvider>
  );
}