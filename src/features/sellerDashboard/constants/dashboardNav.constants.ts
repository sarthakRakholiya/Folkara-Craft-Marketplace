import { NavItem } from "../types/dashboard.types";
import { 
  LayoutDashboard, 
  List, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  Wallet 
} from "lucide-react";

export const SELLER_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/seller/overview", icon: LayoutDashboard },
  { title: "Listings", href: "/seller/listings", icon: List },
  { title: "Orders", href: "/seller/orders", icon: ShoppingBag },
  { title: "Messages", href: "/seller/messages", icon: MessageSquare },
  { title: "Analytics", href: "/seller/analytics", icon: BarChart3 },
  { title: "Payouts", href: "/seller/payouts", icon: Wallet },
];
