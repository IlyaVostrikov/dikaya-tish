"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [40, 0, 0, -40]);
  const slideX = useTransform(scrollYProgress, [0, 0.25], [-60, 0]);

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative min-h-screen bg-cream flex items-center justify-center py-40 px-6 watercolor-bg overflow-hidden"
    >
      {/* Mist overlay */}
      <div className="philosophy-mist" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-[1fr_2fr_1fr] items-center gap-8 lg:gap-16">
        {/* Left brand image */}
        <motion.div
          style={{ opacity, x: slideX }}
          className="hidden md:flex justify-center"
        >
          <img
            src="/brand-left.png"
            alt=""
            loading="lazy"
            className="w-full max-w-[280px] lg:max-w-[340px] h-auto object-contain opacity-90"
          />
        </motion.div>

        {/* Center text */}
        <motion.div style={{ opacity, y }} className="max-w-3xl mx-auto text-center">
          <p className="text-forest/50 text-[11px] tracking-[0.35em] uppercase mb-8 font-medium">
            Философия
          </p>

          <h2
            className="text-forest text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.04em] leading-relaxed mb-12"
            style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
          >
            Сила природы, доведённая до состояния покоя
          </h2>

          {/* Botanical leaf — visual separator between heading and body */}
          <div className="mb-12">
            <img
              src="/leaf.svg"
              alt=""
              className="h-5 w-auto mx-auto text-sage/20"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-8 text-forest/70 text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
            <p>
              В каждом чае есть две стороны — <span className="text-forest/75">дикая</span> и <span className="text-forest/75">тихая</span>.
              Дикая — это лист, земля, горы, воздух, вода.
              Тихая — это пауза, внимание, чашка,
              состояние внутреннего равновесия.
            </p>
            <p>
              Мы не гонимся за количеством. Мы ищем те плантации,
              где туман касается листьев на рассвете, а сборщики знают
              каждый куст в лицо. Семь чаёв. Семь историй. Семь способов
              прикоснуться к тишине.
            </p>
            <p className="text-forest/75 font-serif text-lg italic">
              Чай для внутренней паузы.
            </p>
          </div>
        </motion.div>

        {/* Right brand image */}
        <motion.div
          style={{ opacity, x: useTransform(scrollYProgress, [0, 0.25], [60, 0]) }}
          className="hidden md:flex justify-center"
        >
          <img
            src="/brand-right.png"
            alt=""
            loading="lazy"
            className="w-full max-w-[280px] lg:max-w-[340px] h-auto object-contain opacity-90"
          />
        </motion.div>
      </div>

      {/* Mobile: brand images shown smaller below text */}
      <motion.div
        style={{ opacity }}
        className="md:hidden flex justify-center gap-6 mt-16"
      >
        <img src="/brand-left.png" alt="" loading="lazy" className="w-32 h-auto object-contain opacity-80" />
        <img src="/brand-right.png" alt="" loading="lazy" className="w-32 h-auto object-contain opacity-80" />
      </motion.div>
    </section>
  );
}
