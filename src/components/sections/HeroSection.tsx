"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MountainFog from "@/components/ui/MountainFog";
import AnimatedLogo from "@/components/ui/AnimatedLogo";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <MountainFog />

      {/* Content — positioned above the background */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
        <div className="pointer-events-auto">
          {/* Logo — prominent centerpiece */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="mb-14 flex justify-center"
          >
            <AnimatedLogo variant="hero" isLight />
          </motion.div>

          {/* Slogan */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white/95 tracking-[0.06em] leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
              textShadow: "0 2px 40px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            Тихий ритуал.
            <br />
            Дикий характер.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-white/60 text-sm md:text-base font-light tracking-[0.10em] mt-8 max-w-lg mx-auto leading-relaxed"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            Чай для внутренней паузы. Сила природы, доведённая до состояния покоя.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-14"
          >
            <a
              href="#catalog"
              className="inline-block px-8 py-3 border border-white/25 text-white/65 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-700 text-[10px] tracking-[0.3em] uppercase font-light backdrop-blur-sm"
            >
              Открыть каталог
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-white/20"
        />
      </motion.div>
    </section>
  );
}
