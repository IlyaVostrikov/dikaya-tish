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
      <main className="min-h-screen bg-cream flex items-center justify-center px-6 pt-32">
        <div className="text-center">
          <p className="text-forest/60 text-sm font-light mb-6">Корзина пуста</p>
          <button
            onClick={() => router.push("/#catalog")}
            className="text-forest/60 hover:text-forest/80 text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-500"
          >
            ← В каталог
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-32 pb-40 px-6">
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-16 h-16 mx-auto mb-10 rounded-full border border-forest/[0.06] flex items-center justify-center"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-forest/55">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </motion.div>
              <h2
                className="text-forest text-2xl font-light tracking-[0.06em] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
              >
                Заказ принят
              </h2>
              <p className="text-forest/65 text-sm font-light leading-relaxed max-w-sm mx-auto mb-12">
                Мы свяжемся с вами в ближайшее время для подтверждения.
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 border border-forest/25 text-forest/60 hover:text-forest/80 hover:border-forest/35 transition-all duration-500 text-[10px] tracking-[0.2em] uppercase font-medium"
              >
                На главную
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-forest text-2xl font-light tracking-[0.06em] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
              >
                Оформление заказа
              </h1>
              <p className="text-forest/60 text-xs tracking-[0.08em] mb-14 font-light">
                Заполните форму, и мы свяжемся с вами
              </p>

              {/* Order summary */}
              <div className="mb-12 p-6 border border-forest/[0.04]">
                <h3 className="text-forest/55 text-[10px] tracking-[0.2em] uppercase mb-5 font-medium">Ваш заказ</h3>
                {items.map((item) => (
                  <div key={item.slug} className="flex justify-between items-center py-2.5 text-sm font-light">
                    <span className="text-forest/60">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-forest/60">
                      {(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-5 mt-5 border-t border-forest/[0.04]">
                  <span className="text-forest/70 text-sm font-medium">Итого</span>
                  <span
                    className="text-forest text-xl font-light"
                    style={{ fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" }}
                  >
                    {totalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-forest/55 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Имя *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full bg-transparent border border-forest/18 px-4 py-3 text-forest/70 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/35"
                    placeholder="Иван Петров"
                  />
                </div>
                <div>
                  <label className="block text-forest/55 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Телефон *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full bg-transparent border border-forest/18 px-4 py-3 text-forest/70 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/35"
                    placeholder="+7 999 123-45-67"
                  />
                </div>
                <div>
                  <label className="block text-forest/55 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-transparent border border-forest/18 px-4 py-3 text-forest/70 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/35"
                    placeholder="mail@example.com"
                  />
                </div>
                <div>
                  <label className="block text-forest/55 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Адрес доставки *</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full bg-transparent border border-forest/18 px-4 py-3 text-forest/70 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/35"
                    placeholder="Город, улица, дом, квартира"
                  />
                </div>
                <div>
                  <label className="block text-forest/55 text-[10px] tracking-[0.15em] uppercase mb-2 font-medium">Комментарий</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => update("comment", e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border border-forest/15 px-4 py-3 text-forest/70 text-sm font-light focus:outline-none focus:border-forest/25 transition-colors placeholder:text-forest/35 resize-none"
                    placeholder="Пожелания к заказу..."
                  />
                </div>

                {error && (
                  <p className="text-peach/90 text-xs font-light">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 bg-forest text-cream hover:bg-forest/90 transition-colors duration-500 text-[10px] tracking-[0.25em] uppercase font-light disabled:opacity-40 disabled:cursor-not-allowed mt-8"
                >
                  {loading ? "Отправка..." : "Оформить заказ"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
