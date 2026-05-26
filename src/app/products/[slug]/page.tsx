"use client";

import { useState, use, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { flyToCart } from "@/lib/fly-store";
import { getLocalImage } from "@/lib/images";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const addItem = useCartStore((s) => s.addItem);

  if (!product) notFound();

  const allQueries = [product.imageQuery, ...product.gallery];
  const allImages = allQueries.map((q, i) => {
    if (i === 0 && product.skuImage) return product.skuImage;
    return getLocalImage(q);
  });

  const goToImage = useCallback((i: number) => setActiveImg(i), []);
  const markError = useCallback((i: number) => {
    setImgErrors((prev) => new Set(prev).add(i));
  }, []);

  return (
    <main className="min-h-[100dvh] bg-cream pt-32 pb-40 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-forest/50 hover:text-forest/70 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-500 mb-16"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          В каталог
        </Link>

        <div className="grid md:grid-cols-[5fr_7fr] gap-12 md:gap-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-ivory border border-forest/[0.03] overflow-hidden relative">
              {allImages[activeImg] && !imgErrors.has(activeImg) ? (
                <motion.img
                  key={activeImg}
                  src={allImages[activeImg]}
                  alt={`${product.name} — фото ${activeImg + 1}`}
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  onError={() => markError(activeImg)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-mist/30 via-ivory to-sage/20 flex items-center justify-center">
                  <span className="text-forest/25 text-[10px] tracking-[0.15em] uppercase">
                    Изображение недоступно
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    aria-label={`Фото ${i + 1} из ${allImages.length}`}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i === activeImg
                        ? "bg-forest/60 scale-110"
                        : imgErrors.has(i)
                          ? "bg-forest/10"
                          : "bg-forest/15 hover:bg-forest/25"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <span className="text-forest/50 text-[10px] tracking-[0.2em] uppercase font-medium">
              {product.country} &middot; {product.category}
            </span>
            <h1
              className="text-forest text-4xl md:text-5xl font-light tracking-tighter leading-none mt-4 mb-8"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              {product.name}
            </h1>
            <p className="text-forest/55 text-sm leading-relaxed mb-12 max-w-lg font-light">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/50 text-[10px] tracking-[0.12em] uppercase font-medium">Вкус</span>
                <p className="text-forest/65 text-xs mt-2 leading-relaxed font-light">{product.taste}</p>
              </div>
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/50 text-[10px] tracking-[0.12em] uppercase font-medium">Заваривание</span>
                <p className="text-forest/60 text-xs mt-2 font-light">{product.brewTemp} &middot; {product.brewTime}</p>
              </div>
              <div className="p-5 border border-forest/[0.04]">
                <span className="text-forest/50 text-[10px] tracking-[0.12em] uppercase font-medium">Окисление</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-[2px] bg-forest/[0.04] overflow-hidden">
                    <div className="h-full bg-sage/50" style={{ width: `${product.oxidation}%` }} />
                  </div>
                  <span className="text-forest/55 text-[10px] font-medium">{product.oxidation}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mb-10">
              <span className="text-forest/70 text-2xl font-light font-serif">
                {formatPrice(product.price)} ₽
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Уменьшить количество"
                  className="w-11 h-11 border border-forest/15 flex items-center justify-center text-forest/55 hover:text-forest/80 hover:border-forest/25 transition-colors text-sm"
                >
                  −
                </button>
                <span className="text-forest/70 w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Увеличить количество"
                  className="w-11 h-11 border border-forest/15 flex items-center justify-center text-forest/55 hover:text-forest/80 hover:border-forest/25 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <motion.button
              onClick={(e) => {
                for (let i = 0; i < quantity; i++) addItem(product.slug, product.name, product.price);
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                flyToCart.emit({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
              }}
              whileTap={{ scale: 0.97 }}
              className="self-start px-10 py-3 border border-forest/12 hover:border-forest/25 text-forest/55 hover:text-forest/80 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-500"
            >
              В корзину
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
