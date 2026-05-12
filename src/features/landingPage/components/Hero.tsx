import Image from "next/image";

export function Hero() {
  return (
    <section className="relative px-6 md:px-margin-page py-16 md:py-24 max-w-container-max mx-auto overflow-visible">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-6 z-20">
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            SINCE MCMXCVIII
          </span>
          <h2 className="font-serif text-[44px] md:text-[64px] lg:text-[80px] text-primary mb-6 md:mb-8 leading-[0.95] tracking-tight italic font-normal">
            The Earth’s <br />
            Untamed <br />
            Offering
          </h2>
          <p className="text-on-surface-variant text-lg mb-10 max-w-md leading-relaxed">
            Every creation begins with the silent patience of the earth. Raw
            clay from the riverbeds, wool sheared in the mountain air, and
            timber that has witnessed a century of seasons.
          </p>

          <div className="p-8 bg-tertiary-fixed/40 rounded-xl border border-tertiary-fixed/60 relative overflow-hidden group max-w-sm">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 blur-2xl group-hover:blur-3xl transition-all" />
            <div className="flex gap-4 items-start relative z-10">
              <span
                className="material-symbols-outlined text-secondary animate-pulse"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <div>
                <p className="font-serif italic text-primary leading-relaxed text-lg">
                  &quot;This Highland wool was washed only in local spring water
                  to preserve its integrity.&quot;
                </p>
                <p className="font-sans text-[10px] font-semibold tracking-widest mt-3 text-secondary uppercase">
                  FOLKARA GUIDE
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative mt-12 lg:mt-0">
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
            {/* Organic Background Shape */}
            <div className="organic-shape-1 bg-primary-fixed/30 absolute top-4 left-4 w-[100%] h-[100%] -z-10 rotate-6 opacity-70 blur-[100px] md:top-10 md:left-10 md:w-[110%] md:h-[110%] md:rotate-12 md:scale-110" />

            <div className="absolute inset-0 z-10 p-6 md:p-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
              <Image
                src="/logo-name.png"
                alt="Artisan hands"
                width={500}
                height={100}
                className="w-full h-full object-contain  rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="absolute -top-12 -right-8 w-48 h-64 z-20 shadow-xl overflow-hidden rounded-lg rotate-6 hidden md:block">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoWY8ge1csRgPqRQOTf8_edXH8-368dn948LV53ioBU-e-KdtTpFzsyXvHHWIpVG9qW2IX_NtQ9FxDoE5Lb_nsf7a0qicOYNiiaaNG-QUPu9Ir6jfG1nkqEqr7yazNQ2YbhB51UBYlk7tp4-9fFMb3DNPzGmppwnzMAavdyvppUrEyk42szNXSjMLSGdPpdGs2U7F9RCumRMA-d8Eo_eKTcymdgxkQsEgNuMYT7N4hz4HzFw7KxRr7qsODEWbJD-ektA_S3cra0c"
                alt="Detail 1"
                width={200}
                height={260}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-12 w-56 h-56 z-20 shadow-2xl rounded-full border-8 border-surface overflow-hidden -rotate-12 hidden md:block">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_qQoKSu81LaC2AzZk2ug0LgfF2whQYJvRNddCv4cE__zOniuEI8aQiNb4ubgtWAMXUEgNrJP46ZMMFFIrCbwvkifMD-782VfdWQPAHRWE6BhF1U_vZiV4KYUMRGbVX45hoI8nWr-X5nD5pREtELHaE3Ook23ZSjJYqJLRxR2oYm3cbqnKhX_ZPL06ORMpDwLZOnCx1ZnwnsLXyrMBjIh6Duz_sML-p-0vHC9wKtbcD8iZMIAriBlln4Cte2R6fEPyhQBfxaNiLwk"
                alt="Detail 2"
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
