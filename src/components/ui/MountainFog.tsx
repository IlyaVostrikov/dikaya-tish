"use client";

import { useEffect, useState } from "react";

const FOREST_PHOTO = "/images/misty-forest-mountain-dark-atmospheric.jpg";

export default function MountainFog() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = FOREST_PHOTO;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-forest">
      {/* Mountain forest photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500"
        style={{
          backgroundImage: `url(${FOREST_PHOTO})`,
          opacity: loaded ? 1 : 0,
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(15, 23, 20, 0.55) 0%,
              rgba(15, 23, 20, 0.30) 35%,
              rgba(15, 23, 20, 0.45) 100%
            )
          `,
        }}
      />

      {/* Fog layers — animated mist */}
      <div className="fog-layer fog-slow" />
      <div className="fog-layer fog-medium" />
      <div className="fog-layer fog-fast" />
      <div className="fog-bottom" />
      <div className="fog-foreground" />
    </div>
  );
}
