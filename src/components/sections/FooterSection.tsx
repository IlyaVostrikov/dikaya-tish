"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useSpring(rawY, { stiffness: 80, damping: 25 });
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <footer ref={ref} className="relative bg-forest text-cream/80 py-24 md:py-32 px-6 md:px-12">
      <motion.div style={{ y, opacity }} className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-16 md:gap-24">
          {/* Brand column */}
          <div>
            <h2
              className="text-cream/90 text-2xl md:text-3xl font-light tracking-tighter mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              Дикая Тишь
            </h2>
            <p className="text-cream/70 text-sm leading-relaxed mb-3 font-light max-w-[32ch]">
              Тихий ритуал. Дикий характер.
            </p>
            <p className="text-cream/60 text-sm leading-relaxed font-light max-w-[32ch]">
              Чай, который не требует слов. Заварите и слушайте тишину.
            </p>
          </div>

          {/* Nav column */}
          <div>
            <p className="text-cream/55 text-[10px] tracking-[0.2em] uppercase mb-6 font-medium">
              Разделы
            </p>
            <div className="flex flex-col gap-4 text-cream/60 text-[11px] tracking-[0.15em] uppercase font-medium">
              <Link href="/#catalog" className="hover:text-cream/85 transition-colors duration-500">Каталог</Link>
              <Link href="/countries" className="hover:text-cream/85 transition-colors duration-500">Страны</Link>
              <Link href="/#philosophy" className="hover:text-cream/85 transition-colors duration-500">Философия</Link>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-cream/55 text-[10px] tracking-[0.2em] uppercase mb-6 font-medium">
              Связь
            </p>
            <div className="space-y-3">
              <a
                href="https://t.me/Ilyavostrikov90"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream/60 hover:text-cream/85 text-xs font-light transition-colors duration-500"
              >
                Telegram: @Ilyavostrikov90
              </a>
              <a
                href="mailto:ilyavostrikov90@gmail.com"
                className="block text-cream/60 hover:text-cream/85 text-xs font-light transition-colors duration-500"
              >
                ilyavostrikov90@gmail.com
              </a>
            </div>
          </div>
        </div>

        <p className="text-cream/55 text-[11px] tracking-[0.1em] font-light mt-20 md:mt-28">
          © 2026 Дикая Тишь
        </p>
      </motion.div>
    </footer>
  );
}
