import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AiAssistantFab } from "@/components/layout/AiAssistantFab";

import { getSession } from "@/lib/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isAuthenticated={!!session} 
        userRole={session?.role?.toLowerCase()} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <AiAssistantFab />
      <Footer />
    </div>
  );
}
