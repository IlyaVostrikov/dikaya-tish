import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "./globals.css";
import Header from "@/components/layout/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1F3A34",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dikaya-tish.ru"),
  title: "Дикая Тишь — пространство тишины",
  description:
    "Чай, рождённый в тишине гор. Семь историй с четырёх континентов.",
  openGraph: {
    title: "Дикая Тишь — пространство тишины",
    description: "Чай, рождённый в тишине гор.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-cream text-forest antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
