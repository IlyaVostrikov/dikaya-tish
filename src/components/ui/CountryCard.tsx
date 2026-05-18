"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Country } from "@/data/countries";

export default function CountryCard({ country, index }: { country: Country; index: number }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/unsplash?query=${encodeURIComponent(country.imageQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url && !cancelled) setImgSrc(d.url);
      })
      .catch(() => {});
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
        {/* Watercolor bleed — soft edge glow */}
        <div className="watercolor-bleed" />

        {/* Photo — processed as watercolor base */}
        {imgSrc && (
          <motion.img
            src={imgSrc}
            alt={country.title}
            loading="lazy"
            className="watercolor-img absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Watercolor wash — pigment bleeding */}
        <div className="watercolor-wash-overlay" />

        {/* Watercolor texture — paper grain */}
        <div className="watercolor-texture" />

        {/* Content fade for readability */}
        <div className="watercolor-content-fade" />

        {/* Text content */}
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
