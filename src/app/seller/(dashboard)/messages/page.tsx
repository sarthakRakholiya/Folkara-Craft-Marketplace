import { ComingSoonView } from "@/features/sellerDashboard/components/ComingSoonView";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <ComingSoonView 
      title="Messages" 
      icon={MessageSquare} 
      description="Connect directly with buyers, answer questions, and share the story behind your work."
    />
  );
}
