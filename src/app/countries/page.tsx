"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { countries } from "@/data/countries";

export default function CountriesPage() {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    countries.forEach((c) => {
      fetch(`/api/unsplash?query=${encodeURIComponent(c.imageQuery)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.url) setImages((prev) => ({ ...prev, [c.slug]: d.url }));
        })
        .catch(() => {});
    });
  }, []);

  return (
    <main className="min-h-screen bg-cream pt-32 pb-40 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-28"
        >
          <p className="text-forest/45 text-[10px] tracking-[0.4em] uppercase mb-6 font-light">
            География вкуса
          </p>
          <h1
            className="text-forest/85 text-4xl md:text-5xl font-light tracking-[0.06em]"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            Семь стран
          </h1>
        </motion.div>

        <div className="space-y-40">
          {countries.map((country, i) => (
            <motion.section
              key={country.slug}
              id={country.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className={`grid md:grid-cols-2 gap-16 items-center ${
                i % 2 === 1 ? "md:grid-flow-dense" : ""
              }`}
            >
              {/* Image — watercolor style */}
              <div
                className={`aspect-[4/3] bg-ivory overflow-hidden relative ${
                  i % 2 === 1 ? "md:col-start-2" : ""
                }`}
              >
                {images[country.slug] ? (
                  <>
                    <img
                      src={images[country.slug]}
                      alt={country.title}
                      loading="lazy"
                      className="watercolor-img absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="watercolor-wash-overlay" />
                    <div className="watercolor-texture" />
                    <div className="watercolor-bleed" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" role="status" aria-label="Загрузка изображения">
                    <div className="w-6 h-6 border border-forest/10 rounded-full animate-spin border-t-forest/25" />
                  </div>
                )}
              </div>

              {/* Text — editorial, breathing room */}
              <div className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                <h2
                  className="text-forest/85 text-2xl md:text-3xl font-light tracking-[0.08em] mb-4"
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
                <p className="text-forest/45 text-[10px] tracking-[0.1em] uppercase font-light">
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
          className="text-center mt-40"
        >
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 text-forest/40 hover:text-forest/60 text-[10px] tracking-[0.2em] uppercase font-light transition-colors duration-500"
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
