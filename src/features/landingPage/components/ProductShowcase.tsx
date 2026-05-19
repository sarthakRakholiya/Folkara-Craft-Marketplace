import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Static fallback items shown when there are no products in the DB yet
const fallbackProducts = [
  {
    id: null,
    title: "Hand-Blown Smoked Carafe",
    category: "Glasswork",
    price: "120",
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxoRHh-lOs_XIbo1TNm4C6DwWo6bm9ms2c323p6QIbV8EjuoXY3-Aji87BC77AkeAZjNLlqb3naZwLvM7fw43BcKkRTYVDhUghbFhV72J8TUb141P7SoXWo5mU0ApNW7bwMVKDVN-ChaJjUaX1-d_4mZjaE2vHlSTx9mIMbFdr0pYrO_OOr5VxwPoMhmXSicoZcvJ4I3ugg07ZeRyKgAMpzeIH8zqIyupaVuWQ4kz2RGRr4Mk1UiGhpGG5Q28e_K81zXV-UUssPtg", publicId: "" }],
    shopId: "",
  },
  {
    id: null,
    title: "Riverbed Clay Vessel",
    category: "Ceramics",
    price: "185",
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZIo8UkMCWucfQ4iJsjDiqZzFRoQEiYy6_2lRzzOV1pL5IUmydOtNcCk70WlfUl0tAuwzgTQCR00hJ70CTGiKyZU79NzkeuBkfTWVjJ_jws5-tb-ED_nbOsrth0Ga5f30IT1HXMtU57OWMrZN4_oPdX6iVMK6HuI4SgLD2ZGAiD8cj4ShV690pnWN1WkklMVRnryJY81TB6mugfkYjfpZG3kl93e_eBb9xvYwjKm2uRWeByEAMcXron8BzhQJMdYfSOl-Huokyks", publicId: "" }],
    shopId: "",
  },
  {
    id: null,
    title: "Highland Wool Throw",
    category: "Textiles",
    price: "340",
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg9iJfknTidR7cIaTZ-q-3ybVNKCdcFIgtMkKTXkP-4vC4Iidfd41gffOEDCU0auLvUL5_lVG3aSKeu4FzXGJAK-VS7O4akvPASQyhBc2jHn7jYqwxERWUdjCLFRh8IGC_LANR7RrdjBV1a2nTY5OhiKK7bvKwR8zgA0m6DeXa-AO61TjHZbMe5RnOxOKwY0WQyxh8YGVcwlOLX8R8yFhiy6S7mCFydzSzKPv9qRh2LN9r4F2gXefkaDp_UX9Gg3DhEd6MN3XY_-g", publicId: "" }],
    shopId: "",
  },
  {
    id: null,
    title: "Solid Walnut Fruit Bowl",
    category: "Woodcraft",
    price: "95",
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6rCaAkHKNsgojnEWsmtK7bwMaFaOAoFmLMDh-3kBNYmVjzyWKybudGBkBHyp4LH2tAc8YLWJWaQTtGn51iFJUnE2M9Dy6fPGbIZQd2Z2N9UYBdp2fb01qXTcZOYO2UweIdpi9SpzGvR5cWjagevhtOkWWvs_uo1toLmy3psQwmmNLxoWpAsShOXYU8F5WtiYW4B4ClJH4lvEx2GNH5w8z-HpMbMbEAJogEQGoYP0lVtM4gR9Ao0QjX-8SjHj9IVJCIlyAGcxGb-w", publicId: "" }],
    shopId: "",
  },
];

type TopProduct = {
  id: string | null;
  title: string | null;
  category: string | null;
  price: string | null;
  images: { url: string; publicId: string }[];
  shopId: string;
};

interface ProductShowcaseProps {
  products?: TopProduct[];
}

export function ProductShowcase({ products: dbProducts }: ProductShowcaseProps) {
  // Use real DB products if available (and there are at least 1), otherwise show fallback
  const items: TopProduct[] =
    dbProducts && dbProducts.length > 0
      ? dbProducts.slice(0, 8).map((p) => ({
          ...p,
          images: (p.images ?? []) as { url: string; publicId: string }[],
        }))
      : fallbackProducts;

  const formatPrice = (price: string | null) => {
    if (!price) return "₹0";
    const num = parseFloat(price);
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <section className="py-16 md:py-section-gap px-6 md:px-margin-page max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 md:mb-12 gsap-fade-up">
        <div>
          <h2 className="font-serif text-[32px] md:text-[48px] text-primary leading-tight mb-1">
            Top Products
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            Handmade by skilled sellers on Folkara
          </p>
        </div>
        <Link
          href="/explore"
          className="font-sans text-xs font-semibold tracking-widest text-secondary hover:text-primary transition-colors border-b border-secondary pb-1 uppercase mt-4 md:mt-0"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter gsap-stagger">
        {items.map((product, idx) => {
          const imageUrl = product.images?.[0]?.url ?? "";
          const href = product.id ? `/products/${product.id}` : "/explore";
          return (
            <Link key={product.id ?? `fallback-${idx}`} href={href} className="group flex flex-col gsap-stagger-item">
              <div className="relative overflow-hidden aspect-[4/5] bg-surface-container-low mb-4 rounded-lg">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.title ?? "Handmade product"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 text-sm font-sans">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <Button size="sm" shape="square">
                    VIEW
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-[18px] text-primary leading-tight">
                    {product.title ?? "Handmade Product"}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    {product.category ?? "Craft"}
                  </p>
                </div>
                <span className="font-sans text-base text-primary shrink-0 ml-2">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
