export interface Product {
  id: string;
  type: 'product';
  title: string;
  author: string;
  price: string;
  image: string;
  badge?: {
    text: string;
    variant: 'picked' | 'trending';
  };
}

export interface Editorial {
  id: string;
  type: 'editorial';
  title: string;
  description: string;
  category: string;
  linkText: string;
  image?: string; // Optional for the image-background variant
  variant: 'text-only' | 'image-bg';
}

export type ExploreItem = Product;
