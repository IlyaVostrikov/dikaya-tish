"use client";

import { motion } from "framer-motion";

export default function MicroBreath({
  children,
  className,
  delay = 0,
}: {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.98, 1.02, 0.98] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: [0.16, 1, 0.3, 1] as const,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
