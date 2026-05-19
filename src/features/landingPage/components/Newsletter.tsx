"use client";

import { Button } from "@/components/ui/Button";

export function Newsletter() {
  return (
    <section className="py-16 md:py-24 bg-primary text-on-primary">
      <div className="max-w-2xl mx-auto px-6 md:px-margin-page text-center gsap-scale-up">
        <span className="material-symbols-outlined text-primary-fixed text-4xl mb-6 opacity-40">
          mail
        </span>
        <h2 className="font-serif text-[32px] text-primary-fixed mb-4">Join the Circle</h2>
        <p className="text-on-primary-container text-lg mb-10 leading-relaxed">
          Get updates on new sellers, new products, and be the first to know
          about limited items and exclusive deals.
        </p>
        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            className="flex-grow bg-primary-container/30 border border-primary-fixed/20 text-on-primary px-6 py-4 focus:outline-none focus:border-primary-fixed transition-colors font-sans placeholder:text-on-primary-container/50" 
            placeholder="Your email address" 
            type="email"
            required
          />
          <Button variant="fixed" className="px-8 h-auto">
            SUBSCRIBE
          </Button>
        </form>
        <p className="text-[10px] text-on-primary-container/40 mt-6 tracking-widest uppercase font-semibold">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
