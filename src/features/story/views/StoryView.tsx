"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function StoryView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-background text-on-background selection:bg-secondary-container min-h-screen">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-page pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-label-caps tracking-[0.25em] text-secondary font-bold uppercase bg-secondary/10 px-4 py-1.5 rounded-full inline-block">
              OUR BEGINNINGS
            </span>
            <h1 className="font-serif text-primary text-4xl sm:text-5xl lg:text-6xl leading-tight font-notoSerif">
              Crafted by hand,<br />
              <span className="italic font-normal text-secondary">cherished by soul.</span>
            </h1>
            <p className="font-sans text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-md">
              An editorial exploration into the origins of Folkara and the quiet beauty of intentional living.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-7 relative">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-surface-container shadow-xl relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxPex78vxtbitj59eNN5UF7h69t3G5sA0TWIG_0KcTuj8bqbhuvOIqL24CBfZEW0vCK3O8DmpRMYHHuY3caBraXeVX0rqYgI7TzrpuiIqWvazfHoQHJ2mruRt3gZkH_w0_XrZnvqk5DZUWE6hggbpBj_74VWuTYpzGbAu3AtNhAdt1alXz1O_y1957Y9xLZN4Ta6JkvaoW9sohXN4dcll76JCfkFdG7jCSDqF3IG4rLDL3-kbXTmGt_2s-skL5c2eIhS64WzI_iG4"
                alt="Artisan molding a wet clay vessel"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            </div>
            
            {/* Inset floating secondary image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-10 -left-6 hidden md:block w-48 h-64 bg-white p-4 rounded-xl shadow-lg border border-outline-variant/20"
            >
              <div className="relative w-full h-full overflow-hidden rounded-lg bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBzscZDYy-FaITpmQwbiy9gtxsFCv40dapJkOd1rqmosAvgmyXDeMKJ1GK7q9bhbXg8NKZvTR5tXMXH-ix8dXpM-Xi01kvVAuV-fkJs_XG7_wXNdofVc-LXw73cbFZT1o8R7w8eo1BwjizVsRRtoBL1qT_eT17t_MmefOggHK1bj5bujcRztnIPUG17RmRnQqNuaHcacjF9rX10Lif5eZYdSjcFxkxIgZkP8wJlpJ2jZyDdmbygUGD9J5rcZ27PBbCVOnPIECiXRw"
                  alt="Raw coarse linen weave detail"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* The Philosophy */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-page">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-16 space-y-6"
          >
            <span className="text-[11px] font-label-caps tracking-[0.25em] text-secondary font-bold uppercase">
              THE PHILOSOPHY
            </span>
            <h2 className="font-serif text-primary text-3xl sm:text-4xl italic font-normal font-notoSerif">
              The Rhythm of Slow Craft
            </h2>
            <div className="h-[2px] w-16 bg-secondary mx-auto"></div>
            <p className="font-sans text-on-surface-variant text-base sm:text-lg leading-relaxed">
              In a world obsessed with the immediate, we choose the enduring. Folkara began as a rebellion against the disposable. We believe that an object becomes more beautiful when it carries the weight of time, the warmth of the maker&apos;s hand, and the quiet story of its creation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-surface-container shadow-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxGjq3btWMbrkNT0JThC1JRLJHcv9FMZXAAoO75Ph6PezLVAuqcV46nMpjla9MWuP0ths2EL3SEq4VkmjzVPfoN36b3QJj_E8HMvBf0lt3spMxrBvzzNeuRUFwg0_0gfibnZkMuzoq0NoYMoDzt7v61Re_P4nRyGtVf9whx5UvYx8o3NdapR4OA7P7Tx-sc9azMshWneTrRTqhUpqFcVuYVHXvgGWvcRlPqfmmgriuzy4F9EnYPTu-dqkK7foXYqW31GUtK_zrNRM"
                  alt="Raw Wooden Oak blocks"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-serif italic text-xs tracking-wider text-on-surface-variant text-center font-notoSerif">
                Sustainably Sourced Oak
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="aspect-[16/9] relative overflow-hidden rounded-2xl bg-surface-container shadow-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuzNCffowM2r4YrmwKpnQlJRmMk6YecuKTfEHBZtHYyoRcceomBexeo_qHTbshoRBN_naLL-kDKeuodooyMkDQPeXB_SaFWViXTFYcN35h1UDQJVxXLjJclFq9sFJ60jpx0qvp33fBqyX03vzgkQyCeC2yZvsc4KDJReOvoyui9M04clObvXd6MPlpJh3ZCNK5Eds7UYRCUn7wfRekr1SKnb0ADx8rUF0jWgwC5qZBlIQWH_SAvWgOG_DuX4CcJenspSUDGgLK_uE"
                  alt="Artisan ceramic workshop setup"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-label-caps text-secondary font-bold tracking-widest px-1">
                <span>THE WORKSHOP</span>
                <span>6:00 AM</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-surface-container shadow-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHtN0MHb63f_yFAfCSkXWSTefga6i9WRxhd5WZzKVLhKLpmmXVGXcTd8QpVIAutOj2pekI_OC3FldGio6VQwrTJXJbDVuyV6XnPj6ocQ2FH9knXZ2PqPEiNyxNlkPbnwRwcKSFhPTQ9RbVOrS-YxZALOUd9Z2ZGo8DT6RPWR9arA5GSgsn9pQav7DGCQ3tjZPImHW_Fi0uEPj94y9ttbZlz2RDAoDl8HpWwhd0eypCBSzv0FTDVMhnrHatxu-jZTkowQqmNTCAbes"
                  alt="Tanned artisan leather stitching close-up"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-serif italic text-xs tracking-wider text-on-surface-variant text-center font-notoSerif">
                Vegetable Tanned Leather
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Heritage */}
      <section className="py-24 max-w-container-max mx-auto px-4 md:px-margin-page overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="text-[11px] font-label-caps tracking-[0.25em] text-secondary font-bold uppercase">
              THE HERITAGE
            </span>
            <h2 className="font-serif text-primary text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight font-notoSerif">
              Honoring Ancient Techniques
            </h2>
            <p className="font-sans text-on-surface-variant text-base leading-relaxed">
              We don&apos;t invent; we remember. Every Folkara piece is born from techniques that have survived centuries—kiln-firing at precise moon phases, hand-weaving on traditional floor looms, and natural indigo dyeing that respects the water it returns to.
            </p>

            {/* AI Guide Callout */}
            <div className="p-8 bg-surface-container-low rounded-2xl border-l-4 border-secondary/60 relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4 text-secondary/30">
                <Sparkles size={24} />
              </div>
              <h4 className="font-serif text-primary text-base italic font-bold mb-2 font-notoSerif">
                The Workshop Guide&apos;s Note
              </h4>
              <p className="font-sans text-on-surface-variant text-sm italic leading-relaxed">
                &quot;In the friction between the hand and the tool, soul is born. Notice the subtle irregularities in our ceramics; those are the fingerprints of a human life, not a machine&apos;s calculation.&quot;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="pt-16">
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-surface-container shadow-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtijS1D41TgTNa7cvrD80xNN7ayFeCvpUgaASPRTMlpevFZ3x4v2VekG2t-a5gQ73a9vgFAq-6UtYtXZByHDoTeHAJ6NgyQTSMlhuIPL18YqDYoSeOYaRt4bf7S-X8DLTom3V1qvUv-PFBiUKk7Zi6wA2-NcaOpEtd7_P48rmBR_ivEmIUOvKRGaLgQ61LKSgx3f62ZotpS9fmzgXQjKX7vmgpLi5KpeexYEHUrmlxAFJichPn-tF8A9g3IzYVzkwy829XbrJUMGE"
                  alt="Raw unprocessed wool fibers close-up"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <div className="aspect-[4/6] relative overflow-hidden rounded-2xl bg-surface-container shadow-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf5FAITrhzBiqMHT2ur00mGZX7eahPT_MxVgbSQdNiBEhVkxK4mdH5liXWsTQ5OIGNu1QZWmVRwMIC_PId0NKzbdkX9T_vRgXTxGRuwW_QPYcrTqSWZLi2c2OZgE911o2xCl7kltJIgDvNz6NF0VlClz_1jDnRY-CPXAkBuMGC07FXH_UUNOOSubDvbK8tSSrcAbpSibXzmGLrGV-BtBmbBed5Ecw4Fj5Xt_DQLHcXbCtK2d6s_mlbWm39ZWrPUCFIprqjAasqVTU"
                  alt="Traditional hand weaving loom close-up"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 bg-surface-container-low border-t border-outline-variant/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZNeQoOSmgrhRSCKIc3HB94cbbYBqBlojZzwbyiW4wcE0W448ap5cos6bcYf6qPsQJ0oqW54qHym3kSG5lSR8PukcVSGb7b_JAilnjlgMZroDf3JQtRSDODGe1sZSyktPucVGOfKdQG1Krip8oUlQ9jbbOwyo2KueqBjTOMXEVg-8U-mNgvYWOafXXF-eeVcPy9LnjxaIQEBRvdPGoeiLlwuhwWdntpy2f06SRqSvCP0n_1_NDyrvoM5X1NZC2QejwoBDdBFrvxNk"
            alt="Warm minimalist home setting background"
            fill
            className="object-cover filter blur-[2px]"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
          <span className="text-[11px] font-label-caps tracking-[0.25em] text-secondary font-bold uppercase">
            THE VISION
          </span>
          <h2 className="font-serif text-primary text-4xl sm:text-5xl leading-tight font-notoSerif">
            Living with Intention
          </h2>
          <p className="font-sans text-on-surface-variant text-base sm:text-lg leading-relaxed">
            Our goal is simple: to fill the modern home with objects that ground us. To replace the loud and the fast with the quiet and the permanent. We invite you to join us in this slow-tech revolution.
          </p>
          <div className="pt-4">
            <Link
              href="/explore"
              className="inline-flex bg-primary text-white hover:bg-primary/95 px-10 py-5 rounded-full text-xs font-label-caps tracking-widest uppercase font-bold transition-all shadow-md"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
