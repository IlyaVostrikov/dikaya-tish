import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Look up product IDs by slug for the relation
    const slugs = items.map((i: { slug: string }) => i.slug);
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs } },
    });
    const productBySlug = new Map(products.map((p) => [p.slug, p.id]));

    const order = await prisma.order.create({
      data: {
        name,
        phone,
        email,
        address,
        comment: comment || null,
        total,
        items: {
          create: items.map(
            (i: { slug: string; quantity: number; price: number }) => ({
              productId: productBySlug.get(i.slug) ?? 0,
              quantity: i.quantity,
              price: i.price,
            })
          ),
        },
      },
      include: { items: true },
    });

    // Build Telegram notification
    const itemsList = items
      .map(
        (i: { slug: string; quantity: number; price: number }) =>
          `— ${i.slug}: ${i.quantity} шт × ${i.price}₽ = ${i.quantity * i.price}₽`
      )
      .join("\n");

    const message = [
      `🫖 <b>Новый заказ #${order.id}</b>`,
      ``,
      `<b>Имя:</b> ${name}`,
      `<b>Телефон:</b> ${phone}`,
      `<b>Email:</b> ${email}`,
      `<b>Адрес:</b> ${address}`,
      comment ? `<b>Комментарий:</b> ${comment}` : "",
      ``,
      `<b>Товары:</b>`,
      itemsList,
      ``,
      `<b>Итого:</b> ${total}₽`,
    ]
      .filter(Boolean)
      .join("\n");

    notifyTelegram(message);

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Не удалось создать заказ" },
      { status: 500 }
    );
  }
}
