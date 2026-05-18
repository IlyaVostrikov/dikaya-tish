import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address, comment, items } = body;

    if (!name || !phone || !email || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        name,
        phone,
        email,
        address,
        comment: comment ?? "",
        total,
        items: {
          create: items.map((i: { slug: string; quantity: number; price: number }) => ({
            product: { connect: { slug: i.slug } },
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Send notifications in parallel
    const notifications: Promise<void>[] = [];

    // Telegram bot notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const itemsList = order.items
        .map((i) => `— ${i.product.name} ×${i.quantity} — ${(i.price * i.quantity).toLocaleString()} ₽`)
        .join("\n");
      const msg = [
        `🫖 Новый заказ #${order.id}`,
        ``,
        `👤 ${name}`,
        `📞 ${phone}`,
        `📧 ${email}`,
        `📍 ${address}`,
        comment ? `💬 ${comment}` : "",
        ``,
        `Товары:`,
        itemsList,
        ``,
        `💰 Итого: ${total.toLocaleString()} ₽`,
      ].join("\n");

      notifications.push(
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: msg }),
        }).then(() => {})
      );
    }

    // Wait for notifications (don't fail if they fail)
    await Promise.allSettled(notifications);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
