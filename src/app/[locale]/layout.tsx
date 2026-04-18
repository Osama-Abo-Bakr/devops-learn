import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AiChat from "@/components/chat/AiChat";
import { ProgressProvider } from "@/context/ProgressContext";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <AiChat />
      </div>
    </ProgressProvider>
  );
}
