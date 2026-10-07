"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Country } from "@/data/countries";
import { getLocalImage } from "@/lib/images";

function CountryPlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-ivory via-cream to-mist/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
    </div>
  );
}

export default function CountryCard({ country, index }: { country: Country; index: number }) {
  const [failed, setFailed] = useState(false);
  const src = getLocalImage(country.imageQuery);

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

        {(!src || failed) && <CountryPlaceholder />}

        {src && !failed && (
          <motion.img
            src={src}
            alt={country.title}
            loading="lazy"
            onError={() => setFailed(true)}
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
          <h3 className="text-forest/85 text-xl font-light tracking-[0.08em]">
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
