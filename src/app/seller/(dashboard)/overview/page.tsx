import { DashboardView } from '@/features/sellerDashboard/views/DashboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller Dashboard | Folkara',
  description: 'Manage your artisan shop, listings, and orders.',
};

export default function SellerDashboardPage() {
  return <DashboardView />;
}
