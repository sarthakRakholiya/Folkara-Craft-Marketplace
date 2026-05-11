import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function ChapterTwo() {
  return (
    <section className="bg-primary text-on-primary py-16 md:py-section-gap relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-section-gap items-center">
          <div className="order-2 lg:order-1 relative mt-12 lg:mt-0">
            <div className="text-[60px] md:text-[120px] font-serif opacity-5 absolute -top-10 md:-top-20 -left-5 md:-left-10 select-none pointer-events-none">
              CRAFT
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mt-12">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_qQoKSu81LaC2AzZk2ug0LgfF2whQYJvRNddCv4cE__zOniuEI8aQiNb4ubgtWAMXUEgNrJP46ZMMFFIrCbwvkifMD-782VfdWQPAHRWE6BhF1U_vZiV4KYUMRGbVX45hoI8nWr-X5nD5pREtELHaE3Ook23ZSjJYqJLRxR2oYm3cbqnKhX_ZPL06ORMpDwLZOnCx1ZnwnsLXyrMBjIh6Duz_sML-p-0vHC9wKtbcD8iZMIAriBlln4Cte2R6fEPyhQBfxaNiLwk" 
                  alt="Hand carving wood" 
                  width={300} 
                  height={400} 
                  className="rounded-full aspect-[3/4] object-cover border-4 border-primary-container"
                />
              </div>
              <div>
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoWY8ge1csRgPqRQOTf8_edXH8-368dn948LV53ioBU-e-KdtTpFzsyXvHHWIpVG9qW2IX_NtQ9FxDoE5Lb_nsf7a0qicOYNiiaaNG-QUPu9Ir6jfG1nkqEqr7yazNQ2YbhB51UBYlk7tp4-9fFMb3DNPzGmppwnzMAavdyvppUrEyk42szNXSjMLSGdPpdGs2U7F9RCumRMA-d8Eo_eKTcymdgxkQsEgNuMYT7N4hz4HzFw7KxRr7qsODEWbJD-ektA_S3cra0c" 
                  alt="Loom weaving" 
                  width={320} 
                  height={400} 
                  className="rounded-t-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="font-sans text-xs font-semibold tracking-widest text-primary-fixed mb-4 block uppercase">
              CHAPTER II
            </span>
            <h2 className="font-serif text-[36px] md:text-[48px] text-primary-fixed mb-6 leading-tight">
              The Intentional Pulse
            </h2>
            <p className="text-on-primary-container text-lg mb-8 leading-relaxed">
              Speed is the enemy of soul. Our makers work at the pace of the material, listening to the wood&apos;s grain and the clay&apos;s moisture. It is a dialogue that cannot be rushed.
            </p>
            <div className="space-y-6">
              <Button 
                variant="fixed" 
                shape="full"
                className="flex items-center gap-6 group py-4 px-8"
              >
                <div className="w-10 h-10 rounded-full border border-primary flex items-center justify-center bg-primary/5">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </div>
                <span className="font-serif text-xl italic normal-case">
                  Watch the Weaver&apos;s Rhythm
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
