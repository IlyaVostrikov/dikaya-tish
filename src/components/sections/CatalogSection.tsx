"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products";

export default function CatalogSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      id="catalog"
      ref={ref}
      className="relative bg-cream py-40 px-6"
    >
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto">
        <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-6 text-center font-medium">
          Каталог
        </p>
        <h2
          className="text-forest text-2xl md:text-3xl font-light tracking-[0.06em] mb-24 text-center"
          style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
        >
          Семь чаёв. Семь историй.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
