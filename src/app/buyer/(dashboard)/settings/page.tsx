import { SettingsView } from "@/features/buyerDashboard/views/SettingsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Folkara",
};

export default function SettingsPage() {
  return <SettingsView />;
}
