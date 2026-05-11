import { ExploreItem } from '../explore.types';

// Mock data to simulate API response with valid high-quality craft images from Unsplash
const MOCK_EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: '1',
    type: 'product',
    title: 'Hand-thrown Clay Vessel',
    author: 'By Studio Haru, Kyoto',
    price: '$145',
    image: 'https://images.unsplash.com/photo-1578749553376-7876a469796e?auto=format&fit=crop&q=80&w=800',
    badge: { text: 'Picked for you', variant: 'picked' }
  },
  {
    id: '2',
    type: 'product',
    title: 'Textured Linen Throw',
    author: 'By Weaver\'s Knot',
    price: '$88',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    badge: { text: 'Trending', variant: 'trending' }
  },
  {
    id: '3',
    type: 'product',
    title: 'Raw Oak Bench',
    author: 'By Forest Craft Collective',
    price: '$420',
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    type: 'product',
    title: 'Hand-cast Bronze Bowl',
    author: 'By Aethelred Smelter',
    price: '$210',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    type: 'product',
    title: 'Organic Cotton Kimono',
    author: 'By EarthThread',
    price: '$165',
    image: 'https://images.unsplash.com/photo-1582236166547-5d2078652f1e?auto=format&fit=crop&q=80&w=800',
    badge: { text: 'Picked for you', variant: 'picked' }
  },
  {
    id: '6',
    type: 'product',
    title: 'Hand-dip Taper Candles',
    author: 'By Lumiere Artisans',
    price: '$32',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    type: 'product',
    title: 'Woven Sisal Basket',
    author: 'By Highland Weavers',
    price: '$54',
    image: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    type: 'product',
    title: 'Hammered Copper Kettle',
    author: 'By Coppersmith Guild',
    price: '$180',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    type: 'product',
    title: 'Indigo Dyed Scarf',
    author: 'By Blue Earth Studio',
    price: '$65',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    type: 'product',
    title: 'Ash Wood Cutting Board',
    author: 'By Grain & Knot',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    type: 'product',
    title: 'Terracotta Planter',
    author: 'By Earth & Fire',
    price: '$45',
    image: 'https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '12',
    type: 'product',
    title: 'Brass Spoon Set',
    author: 'By Kitchen Forge',
    price: '$75',
    image: 'https://images.unsplash.com/photo-1510251148411-a83151f1580f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '13',
    type: 'product',
    title: 'Wool Felt Coasters',
    author: 'By Soft Touch Crafts',
    price: '$28',
    image: 'https://images.unsplash.com/photo-1591871925063-d437a1b7289b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '14',
    type: 'product',
    title: 'Ceramic Soap Dish',
    author: 'By Clean Earth Potter',
    price: '$38',
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '15',
    type: 'product',
    title: 'Minimalist Teapot',
    author: 'By Zen Craft',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1595304033100-34863378b87e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '16',
    type: 'product',
    title: 'Hand-woven Jute Rug',
    author: 'By Nomadic Hands',
    price: '$250',
    image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&q=80&w=800'
  }
];

export const exploreService = {
  getExploreItems: async (): Promise<ExploreItem[]> => {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_EXPLORE_ITEMS;
  }
};
