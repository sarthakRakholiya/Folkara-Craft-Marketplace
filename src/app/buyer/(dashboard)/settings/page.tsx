import { SettingsView } from "@/features/buyer/settings/views/SettingsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Folkara",
};

export default function SettingsPage() {
  return <SettingsView />;
}
