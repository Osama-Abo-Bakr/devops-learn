import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AiChat from "@/components/chat/AiChat";
import StreakXPBar from "@/components/progress/StreakXPBar";
import { ProgressProvider } from "@/context/ProgressContext";

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