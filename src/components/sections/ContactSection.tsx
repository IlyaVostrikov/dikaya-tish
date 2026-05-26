"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import MountainFog from "@/components/ui/MountainFog";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  const lynxY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-[70dvh] w-full overflow-hidden flex items-center bg-forest"
    >
      {/* Mountain background */}
      <MountainFog />

      {/* Lynx watercolor — right side */}
      <motion.div
        style={{ y: lynxY }}
        className="absolute right-0 top-[5%] bottom-[5%] w-[45%] md:w-[38%] lg:w-[32%] z-[1] pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      >
        <img
          src="/lynx-illustration.png"
          alt=""
          className="w-full h-full object-contain"
          style={{
            filter: "saturate(0.35) contrast(0.75) brightness(0.65)",
            opacity: 0.55,
            mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"],
          }}
        />
      </motion.div>

      {/* Content — left-aligned */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-xl">
          <p className="text-white/40 text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">
            Связаться с нами
          </p>

          <h2
            className="text-white/90 text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-none mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
            }}
          >
            Напишите нам
          </h2>

          <p
            className="text-white/50 text-sm md:text-base font-light leading-relaxed mb-10 max-w-[42ch]"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            Вопросы о чае, заказ, сотрудничество — пишите. Отвечаем лично.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="https://t.me/Ilyavostrikov90"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/65 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-colors duration-500 text-[11px] tracking-[0.25em] uppercase font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.099.153.232.169.326.016.094.036.306.022.472z"/>
              </svg>
              Telegram
            </motion.a>

            <motion.a
              href="mailto:ilyavostrikov90@gmail.com"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/65 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-colors duration-500 text-[11px] tracking-[0.25em] uppercase font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Mobile lynx — small bottom-right accent */}
      <img
        src="/lynx-small.png"
        alt=""
        aria-hidden="true"
        className="absolute right-2 bottom-4 w-[100px] h-auto object-contain pointer-events-none select-none md:hidden"
        style={{ filter: "saturate(0.35) contrast(0.7) brightness(0.6)", opacity: 0.3 }}
      />
    </section>
  );
}
