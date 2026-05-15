import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface DashboardStats {
  revenue: number;
  revenueGrowth: number;
  activeOrders: number;
  activeOrdersHistory: number[];
  storeViews: number;
  storeViewsHistory: number[];
  conversionRate: number;
  industryAvgConversion: number;
}

export interface ListingItem {
  id: string;
  title: string;
  price: number;
  stock: number;
  image: string;
  tag?: {
    text: string;
    type: 'trending' | 'low-stock' | 'default';
    icon?: string;
  };
  description: string;
}

export interface OrderItem {
  id: string;
  date: string;
  buyer: {
    name: string;
    initials: string;
    bgColor: string;
    textColor: string;
  };
  item: {
    title: string;
    image: string;
  };
  status: 'Paid' | 'Shipped' | 'Pending';
  total: number;
}

export interface ArtisanInsight {
  icon: string;
  text: string;
}
