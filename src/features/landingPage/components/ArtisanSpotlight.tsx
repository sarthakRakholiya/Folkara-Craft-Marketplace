import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function ArtisanSpotlight() {
  return (
    <section className="py-16 md:py-section-gap px-6 md:px-margin-page max-w-container-max mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-section-gap items-center">
        <div className="relative mb-12 lg:mb-0 gsap-slide-right">
          {/* Organic Shape Backdrop */}
          <div className="organic-shape-2 bg-secondary-container absolute inset-0 -z-10 opacity-30 rotate-45 scale-125" />
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoWY8ge1csRgPqRQOTf8_edXH8-368dn948LV53ioBU-e-KdtTpFzsyXvHHWIpVG9qW2IX_NtQ9FxDoE5Lb_nsf7a0qicOYNiiaaNG-QUPu9Ir6jfG1nkqEqr7yazNQ2YbhB51UBYlk7tp4-9fFMb3DNPzGmppwnzMAavdyvppUrEyk42szNXSjMLSGdPpdGs2U7F9RCumRMA-d8Eo_eKTcymdgxkQsEgNuMYT7N4hz4HzFw7KxRr7qsODEWbJD-ektA_S3cra0c" 
            alt="Elena in her studio" 
            width={600} 
            height={750} 
            className="w-full aspect-[4/5] object-cover rounded-lg shadow-2xl relative z-10"
          />
        </div>
        <div className="gsap-stagger">
          <span className="font-sans text-xs font-semibold tracking-widest text-secondary mb-4 block uppercase gsap-stagger-item">
            SELLER SPOTLIGHT
          </span>
          <h2 className="font-serif text-[32px] md:text-[48px] text-primary mb-6 leading-tight gsap-stagger-item">
            Elena’s Solstice Series
          </h2>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed gsap-stagger-item">
            Based on the coast, Elena makes ceramics by hand. Her special glazing technique gives each piece its unique crackled finish — no two items look the same.
          </p>
          <div className="flex flex-col gap-6 gsap-stagger-item">
            <div className="flex items-center gap-4 text-primary">
              <span className="material-symbols-outlined">location_on</span>
              <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase">SANTORINI, GREECE</span>
            </div>
            <div className="flex items-center gap-4 text-primary">
              <span className="material-symbols-outlined">brush</span>
              <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase">CERAMICS & NATURAL PIGMENTS</span>
            </div>
          </div>
          <div className="gsap-stagger-item">
            <Button variant="primary" size="lg" className="mt-12">
              EXPLORE THE COLLECTION
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
