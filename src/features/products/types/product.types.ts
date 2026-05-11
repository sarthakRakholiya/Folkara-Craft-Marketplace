export interface Product {
  id: string;
  title: string;
  maker: {
    name: string;
    href: string;
    bio?: string;
    imageUrl?: string;
  };
  price: string;
  description: string;
  longDescription?: string;
  images: string[];
  details: {
    materials: string;
    dimensions: string;
    care: string;
  };
  recommendations: Array<{
    id: string;
    title: string;
    price: string;
    imageUrl: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    content: string;
    avatarUrl: string;
  }>;
}
