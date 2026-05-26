"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка при оформлении");
      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  if (items.length === 0 && !submitted) {
    return (
      <main className="min-h-[100dvh] bg-cream pt-40 pb-40 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-forest/55 text-sm font-light mb-6">Корзина пуста</p>
          <button
            onClick={() => router.push("/#catalog")}
            className="text-forest/55 hover:text-forest/80 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors duration-500"
          >
            &larr; В каталог
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-cream pt-32 pb-40 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="py-24"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                  className="w-16 h-16 mb-10 rounded-full border border-forest/[0.06] flex items-center justify-center"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-forest/55">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </motion.div>
                <h2
                  className="text-forest text-2xl font-light tracking-tighter mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                >
                  Заказ принят
                </h2>
                <p className="text-forest/60 text-sm font-light leading-relaxed max-w-sm mb-12">
                  Мы свяжемся с вами в ближайшее время для подтверждения.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 border border-forest/12 hover:border-forest/25 text-forest/55 hover:text-forest/80 transition-all duration-500 text-[11px] tracking-[0.2em] uppercase font-medium"
                >
                  На главную
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <h1
                  className="text-forest text-2xl font-light tracking-tighter mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                >
                  Оформление заказа
                </h1>
                <p className="text-forest/55 text-[11px] tracking-[0.1em] mb-14 font-light">
                  Заполните форму, и мы свяжемся с вами
                </p>

                <div className="mb-12 p-6 border border-forest/[0.04]">
                  <h3 className="text-forest/50 text-[10px] tracking-[0.2em] uppercase mb-5 font-medium">Ваш заказ</h3>
                  {items.map((item) => (
                    <div key={item.slug} className="flex justify-between items-center py-2.5 text-sm font-light">
                      <span className="text-forest/55">
                        {item.name} &times; {item.quantity}
                      </span>
                      <span className="text-forest/55">
                        {formatPrice(item.price * item.quantity)} ₽
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-5 mt-5 border-t border-forest/[0.04]">
                    <span className="text-forest/65 text-sm font-medium">Итого</span>
                    <span
                      className="text-forest text-xl font-light"
                      style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                    >
                      {formatPrice(totalPrice())} ₽
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-forest/50 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Имя *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full bg-transparent border border-forest/15 px-4 py-3 text-forest/65 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/30"
                      placeholder="Иван Петров"
                    />
                  </div>
                  <div>
                    <label className="block text-forest/50 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Телефон *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-transparent border border-forest/15 px-4 py-3 text-forest/65 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/30"
                      placeholder="+7 999 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-forest/50 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-transparent border border-forest/15 px-4 py-3 text-forest/65 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/30"
                      placeholder="mail@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-forest/50 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Адрес доставки *</label>
                    <input
                      required
                      type="text"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      className="w-full bg-transparent border border-forest/15 px-4 py-3 text-forest/65 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/30"
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>
                  <div>
                    <label className="block text-forest/50 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Комментарий</label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => update("comment", e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border border-forest/12 px-4 py-3 text-forest/65 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/30 resize-none"
                      placeholder="Пожелания к заказу..."
                    />
                  </div>

                  {error && (
                    <p className="text-red-400/80 text-xs font-light">{error}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 bg-forest text-cream hover:bg-forest/90 transition-colors duration-500 text-[11px] tracking-[0.2em] uppercase font-light disabled:opacity-40 disabled:cursor-not-allowed mt-8"
                  >
                    {loading ? "Отправка..." : "Оформить заказ"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
