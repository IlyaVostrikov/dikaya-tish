"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { flyToCart } from "@/lib/fly-store";

interface FlyingDot {
  id: number;
  startX: number;
  startY: number;
}

let nextId = 0;

export default function CartFlyDot({ cartRef }: { cartRef: React.RefObject<HTMLElement | null> }) {
  const [dots, setDots] = useState<FlyingDot[]>([]);
  const dotsRef = useRef(dots);
  dotsRef.current = dots;

  useEffect(() => {
    return flyToCart.subscribe((from) => {
      const id = nextId++;
      setDots((prev) => [...prev, { id, startX: from.x, startY: from.y }]);
      // Auto-remove after animation completes
      setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== id));
      }, 800);
    });
  }, []);

  const getTarget = useCallback(() => {
    if (!cartRef.current) return { x: window.innerWidth - 60, y: 24 };
    const rect = cartRef.current.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, [cartRef]);

  return (
    <AnimatePresence>
      {dots.map((dot) => {
        const target = getTarget();
        return (
          <motion.div
            key={dot.id}
            initial={{
              position: "fixed",
              left: dot.startX,
              top: dot.startY,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "var(--color-forest)",
              opacity: 0.7,
              zIndex: 100,
              pointerEvents: "none",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              left: target.x,
              top: target.y,
              width: 4,
              height: 4,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </AnimatePresence>
  );
}
