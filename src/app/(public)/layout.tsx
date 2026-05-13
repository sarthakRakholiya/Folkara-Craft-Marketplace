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
  const user = session ? {
    firstName: session.firstName,
    lastName: session.lastName,
    avatarUrl: session.avatarUrl,
    shopName: session.shopName,
  } : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isAuthenticated={!!session} 
        user={user}
        userRole={session?.role} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <AiAssistantFab />
      <Footer />
    </div>
  );
}
