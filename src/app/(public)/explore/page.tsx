import { Metadata } from "next";
import { ExploreView } from "@/features/explore/views/ExploreView";

export const metadata: Metadata = {
  title: "Explore | Folkara",
  description: "Discover unhurried pieces crafted by hand, reflecting the quiet soul of traditional artistry and modern minimalism.",
};

export default function ExplorePage() {
  return <ExploreView />;
}
