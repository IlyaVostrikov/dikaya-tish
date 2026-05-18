"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import type { TeaProduct } from "@/data/products";

export default function ProductCard({ product }: { product: TeaProduct }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/unsplash?query=${encodeURIComponent(product.imageQuery)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url && !cancelled) setImgSrc(d.url);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product.imageQuery]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.slug, product.name, product.price);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -4 }}
        className="group card-editorial"
      >
        {/* Image — clean, no heavy effects */}
        <div className="aspect-[4/5] overflow-hidden bg-ivory">
          {imgSrc ? (
            <motion.img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.03] ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Загрузка изображения">
              <div className="w-6 h-6 border border-forest/10 rounded-full animate-spin border-t-forest/30" />
            </div>
          )}

          {/* Subtle gradient at bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-cream/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Info — editorial, breathing room */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-forest/55 text-[10px] tracking-[0.15em] uppercase font-medium">
                {product.country}
              </span>
              <h3
                className="text-forest text-base font-light tracking-[0.06em] mt-2"
                style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
              >
                {product.name}
              </h3>
            </div>
            <span className="text-forest/75 text-sm font-medium whitespace-nowrap ml-4 mt-1">
              {formatPrice(product.price)} ₽
            </span>
          </div>

          <p className="text-forest/50 text-[10px] tracking-[0.1em] uppercase font-medium mb-5">
            {product.category} · окисление {product.oxidation}%
          </p>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 border border-forest/15 hover:border-forest/25 text-forest/55 hover:text-forest/80 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-500"
          >
            В корзину
          </motion.button>
        </div>
      </motion.article>
    </Link>
  );
}
