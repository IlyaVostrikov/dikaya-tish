"use client";

import { useEffect, useState, useRef } from "react";

interface PhotoData {
  url: string;
  alt: string;
  author: string;
}

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
];

export default function MountainFog() {
  const [bgUrl, setBgUrl] = useState<string>(FALLBACK_PHOTOS[0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem("mountain-bg");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as PhotoData;
        preloadAndSet(parsed.url);
        return;
      } catch {
        sessionStorage.removeItem("mountain-bg");
      }
    }

    fetch("/api/unsplash?query=misty+mountains+pine+forest+fog")
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          const photoData: PhotoData = {
            url: data.url,
            alt: data.alt || "Горы в тумане",
            author: data.author || "",
          };
          sessionStorage.setItem("mountain-bg", JSON.stringify(photoData));
          preloadAndSet(photoData.url);
        }
      })
      .catch(() => {});
  }, []);

  function preloadAndSet(url: string) {
    const img = new Image();
    img.onload = () => {
      setBgUrl(url);
      setLoaded(true);
    };
    img.onerror = () => {
      // Keep fallback
      setLoaded(true);
    };
    img.src = url;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-forest">
      {/* Mountain photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500"
        style={{
          backgroundImage: `url(${bgUrl})`,
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
