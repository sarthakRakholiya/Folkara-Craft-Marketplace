import { Metadata } from "next";
import { BrowseView } from "@/features/browse/views/BrowseView";

export const metadata: Metadata = {
  title: "Browse by Craft | Folkara",
  description: "Browse the unhurried slow-made disciplines of Folkara, including fine pottery, jewelry, weaving, woodworking, and handmade leatherwork.",
  keywords: ["ceramics", "pottery", "jewelry", "weaving", "woodworking", "leatherwork", "handmade crafts", "artisan goods", "shop handmade"],
};

export default function BrowsePage() {
  return <BrowseView />;
}
