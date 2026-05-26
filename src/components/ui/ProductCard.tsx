"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import type { TeaProduct } from "@/data/products";

export default function ProductCard({ product }: { product: TeaProduct }) {
  const [imgSrc, setImgSrc] = useState<string | null>(product.skuImage ?? null);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (product.skuImage && !imgError) return;
    let cancelled = false;
    fetch(`/api/unsplash?query=${encodeURIComponent(product.imageQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url && !cancelled) setImgSrc(d.url);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product.imageQuery, product.skuImage, imgError]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.slug, product.name, product.price);
  };

  const handleImgError = () => {
    if (product.skuImage && !imgError) {
      setImgError(true);
      return;
    }
    setImgSrc(null);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="group card-editorial flex flex-col h-full"
      >
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden bg-ivory relative">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onError={handleImgError}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border border-forest/10 rounded-full animate-spin border-t-forest/30" />
              <span className="text-forest/25 text-[9px] tracking-[0.15em] uppercase">Загрузка</span>
            </div>
          )}

          {/* Hover overlay — subtle darkening from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-cream/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-forest/45 text-[10px] tracking-[0.15em] uppercase font-medium">
            {product.country}
          </span>
          <h3
            className="text-forest text-sm md:text-base font-light tracking-[0.04em] mt-1.5 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            {product.name}
          </h3>
          <p className="text-forest/40 text-[10px] tracking-[0.08em] uppercase font-medium mt-1.5">
            {product.category} &middot; {product.oxidation}%
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-forest/65 text-sm font-medium">
              {formatPrice(product.price)} ₽
            </span>
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-2 border border-forest/12 hover:border-forest/25 text-forest/50 hover:text-forest/75 text-[10px] tracking-[0.15em] uppercase font-medium transition-all duration-400"
            >
              В корзину
            </motion.button>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
