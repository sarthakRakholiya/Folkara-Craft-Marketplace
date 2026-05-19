import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-section-gap px-margin-page py-section-gap max-w-container-max mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-8 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Folkara Icon" 
              width={200}
              height={200}
              className="h-12 w-auto object-contain opacity-80 grayscale" 
            />
            <Image 
              src="/logo-name.png" 
              alt="Folkara Name" 
              width={500}
              height={100}
              className="h-8 w-auto object-contain -ml-2 opacity-80 grayscale" 
            />
          </div>
          <p className="font-sans text-base text-on-surface-variant max-w-sm mb-8">
            © 2024 Folkara. Hand-crafted with intention. We celebrate the beauty of the imperfect and the soul of the maker.
          </p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
              language
            </span>
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
              potted_plant
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
              CURATION
            </span>
            <Link href="/journal" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              The Maker&apos;s Journal
            </Link>
            <Link href="/sustainability" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              Sustainability Promise
            </Link>
            <Link href="/collections" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              Collections
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
              CONTACT
            </span>
            <Link href="/apply" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              Seller Application
            </Link>
            <Link href="/shipping" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              Shipping & Care
            </Link>
            <Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-all duration-500 font-sans text-base">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
