import Image from "next/image";

export function Testimonials() {
  return (
    <section className="bg-surface-container py-section-gap relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-page">
        <div className="text-center mb-16">
          <span className="font-sans text-xs font-semibold tracking-widest text-secondary mb-4 block uppercase">
            VOICES OF INTENTION
          </span>
          <h2 className="font-serif text-[48px] text-primary">Shared Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Story 1: Collector */}
          <div className="bg-surface p-12 shadow-sm border border-outline-variant/10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-2 border-tertiary-fixed relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFAspWas4C-Q9qxgdYqur2w90pHVvkA11MeQTUYsQmYyqhGZ6yLOWyUgCXklqaZqiV_hu0QhHbwmCq5hhmfMzA-dPXQzqNqxVSDrwpPGgWL4FqXg_uu8gVb3jaGLUhrA7njzqkmBhBqL2P1TWo859x9etVIRKmRkcl9BzlYKvv-WnywZhFrgFO1lCCPthmLWhVlS--BgjspGBk3SxO9gUsLFKLwG6e6nMXL66kX_UuWROAc9JyPoqlGe1PBpjS_vLMYoITRDPuENs" 
                alt="Collector Portrait" 
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">
              format_quote
            </span>
            <blockquote className="font-serif italic text-2xl text-primary mb-6 leading-relaxed">
              &quot;The textures of the linen throw transformed my morning routine into a ceremony. You can feel the mountain air in every thread.&quot;
            </blockquote>
            <p className="font-sans text-xs font-semibold tracking-widest text-on-surface-variant uppercase">
              — JULIA H., COLLECTOR
            </p>
          </div>
          
          {/* Story 2: Maker */}
          <div className="bg-primary text-on-primary p-12 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-2 border-primary-fixed relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_qQoKSu81LaC2AzZk2ug0LgfF2whQYJvRNddCv4cE__zOniuEI8aQiNb4ubgtWAMXUEgNrJP46ZMMFFIrCbwvkifMD-782VfdWQPAHRWE6BhF1U_vZiV4KYUMRGbVX45hoI8nWr-X5nD5pREtELHaE3Ook23ZSjJYqJLRxR2oYm3cbqnKhX_ZPL06ORMpDwLZOnCx1ZnwnsLXyrMBjIh6Duz_sML-p-0vHC9wKtbcD8iZMIAriBlln4Cte2R6fEPyhQBfxaNiLwk" 
                alt="Maker Portrait" 
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">
              format_quote
            </span>
            <blockquote className="font-serif italic text-2xl text-primary-fixed mb-6 leading-relaxed">
              &quot;Folkara allows me to honor the slow curing of the wood. My process isn&apos;t dictated by the clock, but by the material&apos;s voice.&quot;
            </blockquote>
            <p className="font-sans text-xs font-semibold tracking-widest text-on-primary-container uppercase">
              — ARIS T., WOOD ARTISAN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
