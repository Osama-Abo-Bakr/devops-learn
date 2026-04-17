import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1">{children}</main>
      <Footer />
    </div>
  );
}