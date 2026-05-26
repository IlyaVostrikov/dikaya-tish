"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { countries } from "@/data/countries";

function CountryImage({
  query,
  alt,
  side,
}: {
  query: string;
  alt: string;
  side: "left" | "right";
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/unsplash?query=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.url) {
          setImgSrc(d.url);
          setState("loaded");
        } else if (!cancelled) {
          setState("error");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div
      className={`aspect-[4/3] bg-ivory overflow-hidden relative ${
        side === "right" ? "md:order-2" : ""
      }`}
    >
      {state === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
      )}

      {state === "error" && (
        <div className="absolute inset-0 bg-gradient-to-br from-mist/30 via-ivory to-sage/20 flex items-center justify-center">
          <span className="text-forest/25 text-[10px] tracking-[0.15em] uppercase">
            Изображение недоступно
          </span>
        </div>
      )}

      {imgSrc && (
        <>
          <img
            src={imgSrc}
            alt={alt}
            loading="lazy"
            className="watercolor-img absolute inset-0 w-full h-full object-cover"
          />
          <div className="watercolor-wash-overlay" />
          <div className="watercolor-texture" />
          <div className="watercolor-bleed" />
        </>
      )}
    </div>
  );
}

export default function CountriesPage() {
  return (
    <main className="min-h-[100dvh] bg-cream pt-32 pb-40 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-28"
        >
          <p className="text-forest/45 text-[11px] tracking-[0.35em] uppercase mb-4 font-medium">
            География вкуса
          </p>
          <h1
            className="text-forest text-4xl md:text-5xl font-light tracking-tighter leading-none max-w-[14ch]"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            Семь стран
          </h1>
        </motion.div>

        <div className="space-y-32 md:space-y-40">
          {countries.map((country, i) => (
            <motion.section
              key={country.slug}
              id={country.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.06 }}
              className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
            >
              <CountryImage
                query={country.imageQuery}
                alt={country.title}
                side={i % 2 === 1 ? "right" : "left"}
              />

              <div>
                <h2
                  className="text-forest text-2xl md:text-3xl font-light tracking-tighter mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                >
                  {country.name}
                </h2>
                <p className="text-forest/55 text-base font-light mb-6 font-serif italic">
                  {country.title}
                </p>
                <p className="text-forest/55 text-sm leading-relaxed max-w-md mb-6 font-light">
                  {country.description}
                </p>
                <p className="text-forest/45 text-[10px] tracking-[0.15em] uppercase font-medium">
                  {country.teas}
                </p>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 md:mt-40"
        >
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 text-forest/40 hover:text-forest/60 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-500"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            К каталогу
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
