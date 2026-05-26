"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Country } from "@/data/countries";

function CountryPlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-ivory via-cream to-mist/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
    </div>
  );
}

export default function CountryCard({ country, index }: { country: Country; index: number }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/api/unsplash?query=${encodeURIComponent(country.imageQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.url) setImgSrc(d.url);
        if (!cancelled && !d.url) setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [country.imageQuery]);

  return (
    <Link href={`/countries#${country.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
        className="watercolor-card aspect-[3/4]"
      >
        <div className="watercolor-bleed" />

        {loading && <CountryPlaceholder />}

        {error && !imgSrc && (
          <div className="absolute inset-0 bg-gradient-to-br from-mist/30 via-ivory to-sage/20 flex items-center justify-center">
            <span className="text-forest/25 text-[10px] tracking-[0.15em] uppercase">Нет фото</span>
          </div>
        )}

        {imgSrc && (
          <motion.img
            src={imgSrc}
            alt={country.title}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="watercolor-img absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="watercolor-wash-overlay" />
        <div className="watercolor-texture" />
        <div className="watercolor-content-fade" />

        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
          <h3
            className="text-forest/85 text-xl font-light tracking-[0.08em]"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            {country.name}
          </h3>
          <p className="text-forest/65 text-xs mt-2 leading-relaxed font-light max-w-[90%]">
            {country.title}
          </p>
          <p className="text-forest/50 text-[10px] mt-4 tracking-[0.08em] uppercase font-medium">
            {country.teas}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
