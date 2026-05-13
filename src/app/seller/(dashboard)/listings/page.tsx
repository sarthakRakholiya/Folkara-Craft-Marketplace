import { ComingSoonView } from "@/components/dashboard/ComingSoonView";
import { List } from "lucide-react";

export default function ListingsPage() {
  return (
    <ComingSoonView 
      title="Listings" 
      icon={List} 
      description="Manage your artisanal catalog, add new products, and keep your inventory fresh."
    />
  );
}
