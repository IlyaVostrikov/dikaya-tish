import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "./globals.css";
import Header from "@/components/layout/Header";

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
    <html lang="ru" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-cream text-forest antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
