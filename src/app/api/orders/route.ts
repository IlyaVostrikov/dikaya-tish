import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function notifyTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      }
    );
  } catch {
    // Notification failure should not break the order
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, comment, items } = body;

    if (!name || !phone || !email || !address) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Корзина пуста" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + i.price * i.quantity,
      0
    );

    // Build Telegram notification (no DB on Vercel — just notify)
    const itemsList = items
      .map(
        (i: { slug: string; name?: string; quantity: number; price: number }) =>
          `— ${i.name || i.slug}: ${i.quantity} шт × ${i.price}₽ = ${i.quantity * i.price}₽`
      )
      .join("\n");

    const message = [
      `🫖 <b>Новый заказ</b>`,
      ``,
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Телефон:</b> ${escapeHtml(phone)}`,
      `<b>Email:</b> ${escapeHtml(email)}`,
      `<b>Адрес:</b> ${escapeHtml(address)}`,
      comment ? `<b>Комментарий:</b> ${escapeHtml(comment)}` : "",
      ``,
      `<b>Товары:</b>`,
      itemsList,
      ``,
      `<b>Итого:</b> ${total}₽`,
    ]
      .filter(Boolean)
      .join("\n");

    await notifyTelegram(message);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Не удалось создать заказ" },
      { status: 500 }
    );
  }
}
