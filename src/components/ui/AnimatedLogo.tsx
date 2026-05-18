"use client";

import React from "react";

type AnimatedLogoProps = {
  variant: "header" | "hero";
  isLight?: boolean;
};

const PARTICLE_CONFIGS = [
  { r: 90, dur: 10, del: 0, dir: "normal" as const, rgb: "183,197,189", op: 0.8 },
  { r: 105, dur: 14, del: -3, dir: "reverse" as const, rgb: "110,140,122", op: 0.7 },
  { r: 80, dur: 8, del: -5, dir: "normal" as const, rgb: "242,201,182", op: 0.8 },
  { r: 115, dur: 16, del: -8, dir: "normal" as const, rgb: "183,197,189", op: 0.65 },
  { r: 95, dur: 12, del: -2, dir: "reverse" as const, rgb: "242,201,182", op: 0.75 },
  { r: 110, dur: 18, del: -11, dir: "reverse" as const, rgb: "110,140,122", op: 0.55 },
  { r: 85, dur: 9, del: -6, dir: "normal" as const, rgb: "200,185,160", op: 0.7 },
];

export default function AnimatedLogo({ variant, isLight }: AnimatedLogoProps) {
  const isHeader = variant === "header";
  const logoSrc = isLight ? "/logo-invers.svg" : "/logo.svg";
  const sizeClass = isHeader ? "h-5 md:h-6" : "h-24 md:h-32 lg:h-40";
  const particleSize = isHeader
    ? "w-[1.5px] h-[1.5px] md:w-[2px] md:h-[2px]"
    : "w-[2.5px] h-[2.5px] md:w-[3px] md:h-[3px] lg:w-[3.5px] lg:h-[3.5px]";
  const scaleFactor = isHeader ? 0.35 : 1;

  return (
    <div className="group relative inline-flex items-center justify-center logo-container">
      <img
        src={logoSrc}
        alt="Дикая Тишь"
        className={`relative z-10 ${sizeClass} w-auto`}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        {PARTICLE_CONFIGS.map((p, i) => {
          const r = p.r * scaleFactor;
          return (
            <span
              key={i}
              className={`orbit-particle absolute rounded-full ${particleSize}`}
              style={
                {
                  "--r": `${r}px`,
                  "--dur": `${p.dur}s`,
                  "--del": `${p.del}s`,
                  "--dir": p.dir,
                  "--color": `rgba(${p.rgb},${p.op})`,
                  "--max-opacity": p.op,
                  "--mid-opacity": p.op * 0.55,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
