import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";

export default async function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "BUYER") {
    redirect("/auth");
  }

  const user = {
    firstName: session.firstName,
    lastName: session.lastName,
    avatarUrl: session.avatarUrl,
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* For buyers, we use the main site header but with dashboard state */}
      <Header isAuthenticated={true} userRole="BUYER" />
      
      <main className="flex-1 pt-24">
        {children}
      </main>
      
      {/* Simple Footer for Dashboard */}
      <footer className="py-12 border-t border-outline-variant/10 text-center">
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold opacity-50">
          © 2026 Folkara • Artisan marketplace
        </p>
      </footer>
    </div>
  );
}
