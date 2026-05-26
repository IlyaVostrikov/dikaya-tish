"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import MicroBreath from "@/components/ui/MicroBreath";

const images = [
  { src: "/creator-portrait.jpg", alt: "Илья Востриков — портрет" },
  { src: "/creator-2.jpg", alt: "Илья Востриков — портрет 2" },
  { src: "/creator-vietnam-1.jpeg", alt: "Закупка кофе во Вьетнаме" },
  { src: "/creator-vietnam-3.jpeg", alt: "Логистика зелёного кофе — Вьетнам" },
];

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

export default function CreatorSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0]);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 25 });

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    if (hovered) return;
    const t = setInterval(next, 4200);
    return () => clearInterval(t);
  }, [hovered, next]);

  return (
    <section
      id="creator"
      ref={ref}
      className="relative min-h-[100dvh] bg-cream flex items-center py-32 md:py-40 px-6 md:px-12 watercolor-bg overflow-hidden"
    >
      {/* Mist overlay */}
      <div className="philosophy-mist" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-[1400px] mx-auto w-full">
        {/* Asymmetric split: left carousel (40%) + right text (60%) */}
        <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
          {/* Left column — image carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
            className="flex flex-col items-center md:items-start"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative w-full max-w-[320px] md:max-w-[380px] lg:max-w-[440px] aspect-[4/5] overflow-hidden border border-forest/4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={images[current].src}
                  alt={images[current].alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: "saturate(0.85) contrast(0.95) brightness(1.02)",
                  }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              {/* Subtle watercolor edge bleed */}
              <div className="absolute inset-0 pointer-events-none" style={{
                boxShadow: "inset 0 0 60px rgba(233, 224, 216, 0.3)",
              }} />
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-2 md:gap-2.5 mt-5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Фото ${i + 1}`}
                  className={`rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-4 h-[3px] bg-sage/50"
                      : "w-[3px] h-[3px] bg-forest/12 hover:bg-forest/25"
                  }`}
                />
              ))}
            </div>

            <p className="text-forest/20 text-[10px] tracking-[0.25em] uppercase mt-6 text-center md:text-left font-light">
              Илья Востриков
            </p>
          </motion.div>

          {/* Right column — text */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p
              variants={fadeUp}
              className="text-forest/45 text-[11px] tracking-[0.35em] uppercase mb-8 font-medium"
            >
              Создатель
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-forest text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-none mb-12 max-w-[18ch]"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
            >
              Илья Востриков. От кофе — к тишине.
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

            <motion.div variants={fadeUp} className="space-y-5 text-forest/60 text-sm md:text-base leading-relaxed font-light max-w-[52ch]">
              <p>
                Пятнадцать лет я провёл внутри кофе — за стойкой, в управлении
                кофейнями, на фермах за зелёным зерном. Каппинги, сенсорный анализ,
                сертификации SCA: я научился слышать вкус и разбирать его на детали.
              </p>
              <p>
                Но кофе — это всегда про скорость. А мне не хватало обратного:{' '}
                <span className="text-forest/75">тишины</span>. Так я пришёл к чаю
                и подошёл к нему с тем же ремеслом: отбор листа по происхождению
                и обработке, понимание ферментации, авторские композиции, контроль
                качества от сырья до готовой пачки.
              </p>
              <p className="text-forest/75 font-serif text-lg italic pt-2">
                «Дикая Тишь» выросла отсюда. Дикая: настоящая, со своим
                характером. Тишь: именно её мне когда-то не хватало.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile: carousel below text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="md:hidden flex flex-col items-center mt-14"
        >
          <div className="relative w-48 h-60 overflow-hidden border border-forest/4">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current].src}
                alt={images[current].alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: "saturate(0.85) contrast(0.95) brightness(1.02)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2.5 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Фото ${i + 1}`}
                className={`rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-4 h-[3px] bg-sage/50"
                    : "w-[3px] h-[3px] bg-forest/12 hover:bg-forest/25"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
