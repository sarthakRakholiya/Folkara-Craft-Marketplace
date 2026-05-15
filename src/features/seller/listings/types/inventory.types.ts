export type ProductStatus = 'active' | 'draft' | 'out-of-stock';

export interface InventoryProduct {
  id: string;
  title: string;
  price: number;
  status: string;
  category: string;
  stockCount: number;
  images: { url: string; publicId: string }[];
  description: string | null;
  tags: string[] | null;
  artisanAnalysis: string | null;
  createdAt: Date;
}

export type SortOption = 'recently-added' | 'price-low-to-high' | 'price-high-to-low' | 'stock-low-to-high';
