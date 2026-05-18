"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <footer ref={ref} className="relative bg-forest text-cream/80 py-24 px-6">
      <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center">
        <h2
          className="text-cream/90 text-2xl md:text-3xl font-light tracking-[0.12em] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
        >
          Дикая Тишь
        </h2>

        <p className="text-cream/70 text-sm max-w-md mx-auto leading-relaxed mb-4 font-light">
          Тихий ритуал. Дикий характер.
        </p>

        <p className="text-cream/65 text-sm max-w-md mx-auto leading-relaxed mb-14 font-light">
          Чай, который не требует слов. Просто заварите и почувствуйте тишину.
        </p>

        <div className="flex items-center justify-center gap-10 text-cream/60 text-[11px] tracking-[0.2em] uppercase mb-14 font-medium">
          <Link href="/#catalog" className="hover:text-cream/80 transition-colors duration-500">Каталог</Link>
          <Link href="/countries" className="hover:text-cream/80 transition-colors duration-500">Страны</Link>
          <Link href="/#philosophy" className="hover:text-cream/80 transition-colors duration-500">Философия</Link>
        </div>

        {/* Contact */}
        <div className="mb-14 space-y-2">
          <p className="text-cream/55 text-[11px] tracking-[0.1em] font-medium">
            Связь с нами
          </p>
          <a
            href="https://t.me/Ilyavostrikov90"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-cream/60 hover:text-cream/80 text-xs font-light transition-colors duration-500"
          >
            Telegram: @Ilyavostrikov90
          </a>
          <a
            href="mailto:ilyavostrikov90@gmail.com"
            className="block text-cream/60 hover:text-cream/80 text-xs font-light transition-colors duration-500"
          >
            ilyavostrikov90@gmail.com
          </a>
        </div>

        <p className="text-cream/60 text-[11px] tracking-[0.1em] font-light">
          © 2026 Дикая Тишь
        </p>
      </motion.div>
    </footer>
  );
}
