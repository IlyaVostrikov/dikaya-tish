"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-forest/25"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream border-l border-forest/[0.04] p-8 safe-top safe-bottom flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <h2
                className="text-forest/80 text-lg font-light tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
              >
                Корзина
              </h2>
              <button onClick={onClose} aria-label="Закрыть корзину" className="text-forest/45 hover:text-forest/70 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-forest/45">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <p className="mt-4 text-xs font-light tracking-[0.1em]">Пусто</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.slug}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex items-center gap-4 p-4 border border-forest/[0.04]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-forest/75 text-sm font-light">{item.name}</p>
                        <p className="text-forest/55 text-[11px] mt-0.5">{formatPrice(item.price)} ₽</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          aria-label="Уменьшить количество"
                          className="w-11 h-11 border border-forest/15 flex items-center justify-center text-forest/55 hover:text-forest/80 hover:border-forest/25 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="text-forest/75 text-xs w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          aria-label="Увеличить количество"
                          className="w-11 h-11 border border-forest/15 flex items-center justify-center text-forest/55 hover:text-forest/80 hover:border-forest/25 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        aria-label="Удалить"
                        className="text-forest/40 hover:text-peach transition-colors ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-forest/[0.04] pt-4 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-forest/50 text-xs tracking-[0.1em] uppercase">Итого</span>
                    <span className="text-forest/80 text-lg font-light font-serif">
                      {formatPrice(totalPrice())} ₽
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full py-3 text-center bg-forest text-cream hover:bg-forest/90 transition-colors text-[11px] tracking-[0.2em] uppercase font-light"
                  >
                    Оформить заказ
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
