"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products";

export default function CatalogSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <section id="catalog" ref={ref} className="relative bg-cream py-32 md:py-40 px-6 md:px-12">
      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-4 font-medium">
            Каталог
          </p>
          <h2
            className="text-forest text-3xl md:text-5xl font-light tracking-tighter leading-none max-w-[20ch]"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            Семь чаёв.
            <br />
            Семь историй.
          </h2>
        </div>

        {/* Responsive grid — 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
