import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function ChapterThree() {
  return (
    <section className="relative py-16 md:py-section-gap overflow-hidden bg-surface-container">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-page text-center">
        <div className="mb-12">
          <span className="font-sans text-xs font-semibold tracking-widest text-secondary mb-4 block uppercase">
            CHAPTER III
          </span>
          <h2 className="font-serif text-[32px] md:text-[48px] text-primary max-w-2xl mx-auto leading-tight">
            Where Intention Resides
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="relative z-10 aspect-video rounded-xl shadow-sm overflow-hidden">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFAspWas4C-Q9qxgdYqur2w90pHVvkA11MeQTUYsQmYyqhGZ6yLOWyUgCXklqaZqiV_hu0QhHbwmCq5hhmfMzA-dPXQzqNqxVSDrwpPGgWL4FqXg_uu8gVb3jaGLUhrA7njzqkmBhBqL2P1TWo859x9etVIRKmRkcl9BzlYKvv-WnywZhFrgFO1lCCPthmLWhVlS--BgjspGBk3SxO9gUsLFKLwG6e6nMXL66kX_UuWROAc9JyPoqlGe1PBpjS_vLMYoITRDPuENs" 
              alt="Minimalist interior with Folkara pieces" 
              fill
              sizes="(max-width: 1200px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center gap-8">
          <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
            The journey concludes in your hands. These are not just objects; they are the artifacts of a slower, more deliberate way of living.
          </p>
          <Button variant="primary" size="lg" className="hover:scale-105">
            COMMENCE YOUR PATH
          </Button>
        </div>
      </div>
    </section>
  );
}
