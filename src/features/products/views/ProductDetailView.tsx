"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "../components/ProductGallery";
import { ProductInfo } from "../components/ProductInfo";
import { MakerStory } from "../components/MakerStory";
import { RelatedProducts } from "../components/RelatedProducts";
import { ProductReviews } from "../components/ProductReviews";
import {
  type Product as DBProduct,
  type Shop as DBShop,
  type User as DBUser,
} from "@/db/schema";

interface ProductDetailViewProps {
  initialData: {
    product: DBProduct;
    shop: DBShop;
    seller: DBUser;
  };
}

export const ProductDetailView = ({
  initialData,
}: ProductDetailViewProps) => {
  const router = useRouter();
  const { product, shop, seller } = initialData;

  // Map data to UI format
  const mappedProduct = {
    id: product.id,
    title: product.title || "Untitled Product",
    price: `₹${product.price}`,
    description: product.description || "",
    images: product.images.map((img) => img.url),
    maker: {
      name: `${seller.firstName} ${seller.lastName}`.trim(),
      shopName: shop.name,
      href: `/shop/${shop.id}`,
      bio: seller.bio || shop.description || "",
      imageUrl: seller.avatarUrl || shop.logoUrl || undefined,
      makerQuote: (seller as any)?.onboardingData?.makerQuote || "",
      establishedYear: new Date(shop.createdAt).getFullYear(),
    },
    quantity: product.quantity,
  };

  // Mock related products matching design spec
  const mockRelated = [
    {
      id: "rel1",
      title: "Salvaged Oak Tray",
      price: "₹6,900",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsiXbuOuzzWCp_MfhdVGLZ1PY_R8jF6isY6kIrNxWSaONx8FYwmma_0leiW_RglgYZwLnipWN-lqvyEZxRxY5Leb087mqBK-6t8fPPK4AzIaoKpw7wUoKgpC5WsfLJydG44DZ4K5RaeoHQnSwx-mQJZNPuU6CMDpD9OytvwJ9C94K8QgmrzQVUgokGd53YrYrPFbrynBXNBprXaFBYWD0hvqs7m9zAy1aDdF1q_V_-dLvN4NcVi9dMDXGyz70MxUHWbj5omdSit8o"
    },
    {
      id: "rel2",
      title: "Stone Linen Napkins (Set of 2)",
      price: "₹2,600",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzpSIfwOWGdUqdbPCFhj5sIcMHVYPCmJA26nCb6PJDvcIBN17BMPCNhD6lf9c7mli10-oVySdweXc03SPY0b48-wdPao9QaWMHDsgX3ZDMPn8Vyqi1hGEc5L8HUcbxVzWTK_tNMnV7iIOaVWpVS9RXsLk6xteU0b60A_eccDcrVjxqyvdGveadhgtpD_F-BT0gzzPp7z4E85xiFgkOGNVueonEG3kbdO0B0EmCJoHAH2MJRl4iQ18P14EKHEdaoAz6Z2_qhJfGzBM"
    },
    {
      id: "rel3",
      title: "Miniature Bud Vase",
      price: "₹3,900",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxBVyAmEVJHs4fERpd24d7TxI0iujpWoIwBGKBp9A2sVMbSKUwr7Y4Qdv5MDqkjRVcRbILLiMzyEC9HQIVsa9Iqd74iremvFzIC0YGmvjtG0ZyfaGQRYtfbK6GtBXrP15bPBnGpWzU8zcgKr4Jkep33L2AmjuflAwvrbJn7S-qGbrkxQALkSFu1GE9AeXjUiXz0VMe69bzrMobGy5_rZ3FQWxDUEvjXGOjrmUWVg_A5EE4kDfqHM_iMaZU0ZuaTuI0ejoeHkq1sMI"
    },
    {
      id: "rel4",
      title: "Ceremonial Grade Matcha",
      price: "₹2,200",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHhV6YulRI1jAXtQ-JuvdcIzMDWBnoIEbj447_qqStJMM_ij5y-62Vu9F9ChmcTV1QdngAfRswT_94GyTcK-Wtla_kr8948EljUJWtr6PI_C-HV9rZvnVPVQ4EDbAWusCdezdRx4T0Pz1fZayjGMZpz5WuWRAAVN0qRJd556txYkDT17uL2hR67QXk64-Mas7C9tChHO3jBVhFdxqLX2TS4vdnhmnk8NEGJoZkRB6dbqYbT6RhJb5xunDohUc2OvaiXVWcwL4X9yo"
    }
  ];

  // Mock reviews matching design spec
  const mockReviews = [
    {
      id: "rev1",
      author: "Elena M.",
      rating: 5,
      content:
        '"The weight of the bowl in my hands is so grounding. You can truly feel the maker\'s energy in every curve."',
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyEq0fkSmnxIhyFESgaI3luljNbcNxHZgQQWBFA_bRHkjk32jSyGUwZ2-0fmLWNcRdGGQfJWbnX05rnUqzl7nDyI3TGZmVf-pcOHCYlZGowIWs4Ko9uE4uzQkF5Wko51OeZSnDdKGIzU_PoPQgaZJgbDw-bPmSAAKKG28vn221tBQjLN5cqJFqg07GswCd0kJk1A2gJhTxcNJD3kjpcWT0Puf-cvwkcu1IxhXBGkU9UOGeGhdQA1dlZJGWJvrHbwld9DrZb9LxDvM",
    },
    {
      id: "rev2",
      author: "Julian R.",
      rating: 5,
      content:
        '"Packaging was thoughtful and plastic-free. The glaze is even more stunning in person—it looks like morning mist on moss."',
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZZu-drNYeqk5zhbnmtP0csyzeV6CTCd_a6NRvPTk9p0orVQHK0TyRYoD_XqcajASx-gzSs_3F5J9vJdVoXqvoVs1qhBZtS1LZgwe57MDM49bTYFLuR1STDIDsHGw2y20jTaxME1_bLwUOTyJ2WbPTrCoDbjEQVfMBXF88X7mnRqgQVxLuVXvZbfiNYhbm5j3A8Nj6xOsO3hoIe15cVwdgN1RAmq63Rhq1SP-Jw7dlrMwiSkQxhgS7C0uSri7U3hOofvgyjIRL-ZA",
    },
    {
      id: "rev3",
      author: "Serafina K.",
      rating: 5,
      content:
        '"The AI guide suggested this based on my previous purchases, and it\'s a perfect match for my kitchen\'s palette."',
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApJWDuIrooPGMb3KnYMkU0xp7bsfSatnucIlwquWS1msXX02M8LaCBPYzt_N-uEC3rySd_EMW4_xKU26I1RcISHhs627aXWCAqzSx0ujhlnEC_tGYgVV0zXMQphJrS0ruPKrCIU4r8rxmsuR4fSSkUo8nure_nJ0cJD3RIVJBkuBqOiI5sjwuJgEG-mDFr8EqErKdu_k8Rh1QbuHPTwjKayKOLKlds_EDF21NHfVkX8kAYU5u_5O2s0jdJ_5uPiZVrch8xykyBXHc",
    },
  ];

  return (
    <main className="w-full bg-surface relative min-h-screen">
      {/* Back Button */}
      <div className="max-w-container-max mx-auto px-margin-page pt-6 md:pt-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Back
          </span>
        </button>
      </div>

      {/* PDP Hero Section */}
      <section className="max-w-container-max mx-auto px-margin-page py-6 md:py-12 flex flex-col md:flex-row gap-8 md:gap-gutter">
        <ProductGallery images={mappedProduct.images} />
        <ProductInfo product={mappedProduct} />
      </section>

      {/* Artisan Story Section */}
      <MakerStory maker={mappedProduct.maker} />

      {/* AI Styling / Recommended Items */}
      <RelatedProducts products={mockRelated} />

      {/* Reviews Section */}
      <ProductReviews reviews={mockReviews} />
    </main>
  );
};
