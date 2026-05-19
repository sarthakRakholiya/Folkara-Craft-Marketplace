import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AiAssistantFab } from "@/components/layout/AiAssistantFab";
import { ScrollTriggerManager } from "@/components/layout/ScrollTriggerManager";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollTriggerManager />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <AiAssistantFab />
      <Footer />
    </div>
  );
}
