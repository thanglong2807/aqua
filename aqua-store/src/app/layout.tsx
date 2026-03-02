import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/siteConfig";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: `${siteConfig.name} - Cửa hàng cá cảnh và phụ kiện thủy sinh`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
