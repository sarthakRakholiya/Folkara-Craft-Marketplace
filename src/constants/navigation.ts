import { NavItem } from "@/types/navigation";

export const SELLER_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/seller/overview", icon: "LayoutDashboard" },
  { title: "Listings", href: "/seller/listings", icon: "List" },
  { title: "Orders", href: "/seller/orders", icon: "ShoppingBag" },
  // { title: "Messages", href: "/seller/messages", icon: "MessageSquare" },
  // { title: "Analytics", href: "/seller/analytics", icon: "BarChart3" },
  // { title: "Payouts", href: "/seller/payouts", icon: "Wallet" },
  { title: "My Profile", href: "/seller/profile", icon: "User" },
  { title: "Settings", href: "/seller/settings", icon: "Settings" },
];

export const BUYER_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/buyer/overview", icon: "LayoutDashboard" },
  { title: "Order History", href: "/buyer/orders", icon: "History" },
  { title: "My Profile", href: "/buyer/profile", icon: "User" },
  { title: "Settings", href: "/buyer/settings", icon: "Settings" },
];
