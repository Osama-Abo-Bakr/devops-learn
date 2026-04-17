import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
        <main className="flex flex-1">{children}</main>
        <Footer />
      </div>
    </ProgressProvider>
  );
}