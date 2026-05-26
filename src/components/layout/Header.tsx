"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import CartSidebar from "./CartSidebar";
import CartFlyDot from "@/components/ui/CartFlyDot";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && menuOpen) setMenuOpen(false);
  }, [menuOpen]);

  // White header only on home page hero (dark bg). Other pages have light backgrounds.
  const isHome = pathname === "/";
  const darkBg = isHome && !scrolled;

  const navTextColor = darkBg
    ? "text-white/60 hover:text-white"
    : "text-forest/55 hover:text-forest/80";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-6 transition-all duration-700 ${
          darkBg
            ? "bg-transparent"
            : "bg-cream/95 shadow-[0_1px_0_rgba(31,58,52,0.04)]"
        }`}
      >
        {/* Logo — switches between dark and light variant */}
        <Link href="/" className="flex items-center">
          <AnimatedLogo variant="header" isLight={darkBg} />
        </Link>

        {/* Desktop nav — minimal */}
        <nav className={`hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] uppercase font-light transition-colors duration-700 ${navTextColor}`}>
          <Link href="/#catalog" className="transition-colors duration-500">
            Чай
          </Link>
          <Link href="/#gongfu" className="transition-colors duration-500">
            Гун Фу Ча
          </Link>
          <Link href="/#philosophy" className="transition-colors duration-500">
            Философия
          </Link>
          <Link href="/countries" className="transition-colors duration-500">
            Страны
          </Link>
          <Link href="/#creator" className="transition-colors duration-500">
            Создатель
          </Link>
          <Link href="/#contact" className="transition-colors duration-500">
            Контакты
          </Link>
        </nav>

        {/* Right: cart + mobile menu */}
        <div className="flex items-center gap-5">
          <button
            ref={cartBtnRef}
            onClick={() => setCartOpen(true)}
            aria-label="Открыть корзину"
            className={`relative transition-colors duration-500 min-w-[44px] min-h-[44px] flex items-center justify-center ${navTextColor}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 text-cream text-[11px] font-medium rounded-full flex items-center justify-center transition-colors duration-700 ${
                    darkBg ? "bg-white/80 text-forest" : "bg-forest"
                  }`}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onKeyDown={handleMenuKey}
            className={`md:hidden transition-colors duration-500 min-w-[44px] min-h-[44px] flex items-center justify-center ${navTextColor}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu — editorial overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-0 z-40 bg-cream/98 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 text-forest/65 text-lg tracking-[0.15em] uppercase font-light font-serif">
              <Link href="/#catalog" onClick={() => setMenuOpen(false)}>Чай</Link>
              <Link href="/#gongfu" onClick={() => setMenuOpen(false)}>Гун Фу Ча</Link>
              <Link href="/#philosophy" onClick={() => setMenuOpen(false)}>Философия</Link>
              <Link href="/countries" onClick={() => setMenuOpen(false)}>Страны</Link>
              <Link href="/#creator" onClick={() => setMenuOpen(false)}>Создатель</Link>
              <Link href="/#contact" onClick={() => setMenuOpen(false)}>Контакты</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <CartFlyDot cartRef={cartBtnRef} />
    </>
  );
}
