"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import MicroBreath from "@/components/ui/MicroBreath";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative min-h-[100dvh] bg-cream flex items-center py-32 md:py-40 px-6 md:px-12 watercolor-bg overflow-hidden"
    >
      {/* Mist overlay */}
      <div className="philosophy-mist" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-[1400px] mx-auto w-full">
        {/* Asymmetric split: left text (60%) + right brand image (40%) */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p
              variants={fadeUp}
              className="text-forest/45 text-[11px] tracking-[0.35em] uppercase mb-8 font-medium"
            >
              Философия
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-forest text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-none mb-12 max-w-[18ch]"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              Тишина, у которой есть вкус
            </motion.h2>

            {/* Botanical leaf separator */}
            <motion.div variants={fadeUp} className="mb-12">
              <MicroBreath className="inline-block" delay={0.8}>
                <img
                  src="/leaf.svg"
                  alt=""
                  className="h-5 w-auto text-sage/20"
                  aria-hidden="true"
                />
              </MicroBreath>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6 text-forest/65 text-sm md:text-base leading-relaxed font-light max-w-[52ch]">
              <p>
                В каждом чае две стороны: <span className="text-forest/75">дикая</span> и <span className="text-forest/75">тихая</span>.
                Дикая: лист, земля, горы, воздух, вода.
                Тихая: пауза, внимание, чашка, равновесие.
              </p>
              <p>
                Мы не гонимся за количеством. Мы работаем с теми плантациями,
                где туман ложится на листья на рассвете, а сборщики знают
                каждый куст в лицо. Семь чаёв. Семь историй. Семь способов
                прикоснуться к тишине.
              </p>
              <p className="text-forest/75 font-serif text-lg italic pt-2">
                Вдох. Глоток. Тишина.
              </p>
            </motion.div>
          </motion.div>

          {/* Right column — stacked brand images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 }}
            className="hidden md:flex flex-col items-center gap-12"
          >
            <img
              src="/brand-right.png"
              alt=""
              loading="lazy"
              className="w-full max-w-[340px] lg:max-w-[420px] h-auto object-contain opacity-85"
            />
            <img
              src="/teaware-square.png"
              alt=""
              loading="lazy"
              className="w-full max-w-[200px] lg:max-w-[260px] h-auto object-contain"
              style={{ filter: "saturate(0.6) contrast(0.85) brightness(0.95)", opacity: 0.7 }}
            />
          </motion.div>
        </div>

        {/* Mobile: brand image centered below text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="md:hidden flex justify-center mt-16"
        >
          <img
            src="/brand-right.png"
            alt=""
            loading="lazy"
            className="w-40 h-auto object-contain opacity-80"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
