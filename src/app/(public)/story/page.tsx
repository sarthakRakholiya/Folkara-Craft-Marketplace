import { Metadata } from "next";
import { StoryView } from "@/features/story/views/StoryView";

export const metadata: Metadata = {
  title: "Our Story | Folkara",
  description: "An editorial exploration into the origins of Folkara, the rhythm of slow craft, and the quiet beauty of intentional living.",
  keywords: ["about folkara", "our story", "intentional living", "slow craft", "artisan origins", "ethical marketplace", "sustainable goods"],
};

export default function StoryPage() {
  return <StoryView />;
}
