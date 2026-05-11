import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    title: "The Alchemy of Wood Smoke",
    date: "OCTOBER 12, 2024",
    excerpt: "How we use traditional smoking techniques to darken walnut without the use of harsh chemical stains.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6rCaAkHKNsgojnEWsmtK7bwMaFaOAoFmLMDh-3kBNYmVjzyWKybudGBkBHyp4LH2tAc8YLWJWaQTtGn51iFJUnE2M9Dy6fPGbIZQd2Z2N9UYBdp2fb01qXTcZOYO2UweIdpi9SpzGvR5cWjagevhtOkWWvs_uo1toLmy3psQwmmNLxoWpAsShOXYU8F5WtiYW4B4ClJH4lvEx2GNH5w8z-HpMbMbEAJogEQGoYP0lVtM4gR9Ao0QjX-8SjHj9IVJCIlyAGcxGb-w",
  },
  {
    title: "The Slow Weave Movement",
    date: "SEPTEMBER 28, 2024",
    excerpt: "Understanding why hand-loomed textiles retain their shape and soul for generations longer than mass-production.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg9iJfknTidR7cIaTZ-q-3ybVNKCdcFIgtMkKTXkP-4vC4Iidfd41gffOEDCU0auLvUL5_lVG3aSKeu4FzXGJAK-VS7O4akvPASQyhBc2jHn7jYqwxERWUdjCLFRh8IGC_LANR7RrdjBV1a2nTY5OhiKK7bvKwR8zgA0m6DeXa-AO61TjHZbMe5RnOxOKwY0WQyxh8YGVcwlOLX8R8yFhiy6S7mCFydzSzKPv9qRh2LN9r4F2gXefkaDp_UX9Gg3DhEd6MN3XY_-g",
  },
  {
    title: "Clay: The Earth's Memory",
    date: "SEPTEMBER 05, 2024",
    excerpt: "A photographic exploration of the riverbeds that provide the raw material for our Earthware series.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZIo8UkMCWucfQ4iJsjDiqZzFRoQEiYy6_2lRzzOV1pL5IUmydOtNcCk70WlfUl0tAuwzgTQCR00hJ70CTGiKyZU79NzkeuBkfTWVjJ_jws5-tb-ED_nbOsrth0Ga5f30IT1HXMtU57OWMrZN4_oPdX6iVMK6HuI4SgLD2ZGAiD8cj4ShV690pnWN1WkklMVRnryJY81TB6mugfkYjfpZG3kl93e_eBb9xvYwjKm2uRWeByEAMcXron8BzhQJMdYfSOl-Huokyks",
  },
];

export function JournalPreview() {
  return (
    <section className="bg-surface-container-low py-16 md:py-section-gap">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-page">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0 mb-12 md:mb-16">
          <div>
            <span className="font-sans text-xs font-semibold tracking-widest text-secondary mb-4 block uppercase">
              THE MAKER&apos;S JOURNAL
            </span>
            <h2 className="font-serif text-[32px] text-primary">Notes from the Floor</h2>
          </div>
          <Link 
            href="/journal" 
            className="text-primary font-sans text-xs font-semibold tracking-widest border-b border-primary hover:text-secondary hover:border-secondary transition-all pb-1 uppercase whitespace-nowrap"
          >
            READ ALL STORIES
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.title} className="group cursor-pointer">
              <div className="overflow-hidden aspect-[16/10] mb-6 relative">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <time className="font-sans text-[10px] font-semibold tracking-widest text-secondary uppercase">
                {article.date}
              </time>
              <h3 className="font-serif text-2xl italic text-primary mt-3 mb-4 group-hover:text-secondary transition-colors">
                {article.title}
              </h3>
              <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
