"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { countries } from "@/data/countries";
import { getLocalImage } from "@/lib/images";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function CountryImage({ query, name }: { query: string; name: string }) {
  const src = getLocalImage(query);

  return (
    <img
      src={src ?? ""}
      alt={name}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      style={{ filter: "saturate(0.55) contrast(0.9) brightness(0.85)" }}
      decoding="async"
    />
  );
}

export default function CountriesSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <section ref={ref} className="relative bg-cream py-32 md:py-40 watercolor-bg">
      <div className="max-w-[1400px] mx-auto">
        <motion.div style={{ opacity }} className="px-6 md:px-12 mb-16 md:mb-24">
          <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-4 font-medium">
            География вкуса
          </p>
          <h2
            className="text-forest text-3xl md:text-5xl font-light tracking-tighter leading-none max-w-[16ch]"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            Семь стран
          </h2>
        </motion.div>

        {/* Horizontal scroll gallery */}
        <motion.div
          style={{ opacity }}
          className="flex gap-4 md:gap-6 overflow-x-auto px-6 md:px-12 pb-4 snap-x snap-mandatory scrollbar-none"
        >
          {countries.map((country, i) => (
            <motion.div
              key={country.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
              className="snap-start shrink-0 w-[75vw] max-w-[380px] md:w-[340px]"
            >
              <Link href={`/countries#${country.slug}`}>
                <div className="group relative aspect-[3/4] bg-paper overflow-hidden">
                  {/* Background image */}
                  <CountryImage query={country.imageQuery} name={country.name} />

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 z-[1] bg-gradient-to-t from-forest/60 via-forest/10 to-transparent" />

                  {/* Country name overlay — bottom */}
                  <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                    <h3
                      className="text-white/90 text-xl md:text-2xl font-light tracking-tight mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                    >
                      {country.name}
                    </h3>
                    <p className="text-white/65 text-xs font-light leading-relaxed max-w-[90%]">
                      {country.title}
                    </p>
                    <p className="text-white/45 text-[10px] mt-3 tracking-[0.12em] uppercase font-medium">
                      {country.teas}
                    </p>
                  </div>

                  {/* Subtle hover border */}
                  <div className="absolute inset-0 border border-white/[0.04] group-hover:border-white/[0.12] transition-colors duration-700 z-20 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ opacity }} className="px-6 md:px-12 mt-12">
          <Link
            href="/countries"
            className="inline-flex items-center gap-2 text-forest/40 hover:text-forest/60 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-500"
          >
            Все страны
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
