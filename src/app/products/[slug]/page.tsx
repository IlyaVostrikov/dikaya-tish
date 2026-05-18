"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!product) return;
    fetch(`/api/unsplash?query=${encodeURIComponent(product.imageQuery)}`)
      .then((r) => r.json())
      .then((d) => { if (d.url) setImgSrc(d.url); })
      .catch(() => {});
  }, [product]);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-cream pt-32 pb-40 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back — minimal */}
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-forest/50 hover:text-forest/70 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-500 mb-16"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          В каталог
        </Link>

        <div className="grid md:grid-cols-5 gap-16">
          {/* Image — editorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="md:col-span-2 aspect-[3/4] bg-ivory border border-forest/[0.03] overflow-hidden"
          >
            {imgSrc && (
              <img src={imgSrc} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
            )}
          </motion.div>

          {/* Details — breathing room */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-3 flex flex-col justify-center"
          >
            <span className="text-forest/60 text-[10px] tracking-[0.25em] uppercase font-medium">
              {product.country} · {product.category}
            </span>
            <h1
              className="text-forest text-4xl md:text-5xl font-light tracking-[0.05em] mt-4 mb-8"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              {product.name}
            </h1>
            <p className="text-forest/70 text-sm leading-relaxed mb-12 max-w-lg font-light">
              {product.description}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/55 text-[10px] tracking-[0.12em] uppercase font-medium">Вкус</span>
                <p className="text-forest/70 text-xs mt-2 leading-relaxed font-light">{product.taste}</p>
              </div>
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/55 text-[10px] tracking-[0.12em] uppercase font-medium">Заваривание</span>
                <p className="text-forest/65 text-xs mt-2 font-light">{product.brewTemp} · {product.brewTime}</p>
              </div>
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/55 text-[10px] tracking-[0.12em] uppercase font-medium">Окисление</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-[2px] bg-forest/[0.04] overflow-hidden">
                    <div
                      className="h-full bg-sage/50 transition-all"
                      style={{ width: `${product.oxidation}%` }}
                    />
                  </div>
                  <span className="text-forest/60 text-[10px] font-medium">{product.oxidation}%</span>
                </div>
              </div>
            </div>

            {/* Price + cart */}
            <div className="flex items-center gap-8 mb-10">
              <span className="text-forest text-2xl font-light font-serif">
                {formatPrice(product.price)} ₽
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Уменьшить количество"
                  className="w-11 h-11 border border-forest/18 flex items-center justify-center text-forest/60 hover:text-forest/80 hover:border-forest/30 transition-colors text-sm"
                >
                  −
                </button>
                <span className="text-forest/75 w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Увеличить количество"
                  className="w-11 h-11 border border-forest/18 flex items-center justify-center text-forest/60 hover:text-forest/80 hover:border-forest/30 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <motion.button
              onClick={() => {
                for (let i = 0; i < quantity; i++) addItem(product.slug, product.name, product.price);
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full md:w-auto px-12 py-3 bg-forest text-cream hover:bg-forest/90 transition-colors duration-500 text-[10px] tracking-[0.25em] uppercase font-light"
            >
              В корзину
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
