"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-emerald-600">
          {siteConfig.name}
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          <Link href="/" className="text-gray-600 hover:text-emerald-500 transition">
            Trang chủ
          </Link>
          <Link href="/danh-muc" className="text-gray-600 hover:text-emerald-500 transition">
            Sản phẩm
          </Link>
          <Link href="/kien-thuc" className="text-gray-600 hover:text-emerald-500 transition">
            Kiến thức
          </Link>
          <Link href="/lien-he" className="text-gray-600 hover:text-emerald-500 transition">
            Liên hệ
          </Link>
        </nav>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:block">
          <form action="/tim-kiem" method="GET" className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              placeholder="Tìm sản phẩm..."
              className="w-64 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
          >
            Gọi ngay
          </a>
          <a
            href={siteConfig.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition"
          >
            Zalo
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? "X" : "☰"}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">

            <Link href="/" className="block text-gray-700 font-medium">
              Trang chủ
            </Link>
            <Link href="/danh-muc" className="block text-gray-700 font-medium">
              Sản phẩm
            </Link>
            <Link href="/kien-thuc" className="block text-gray-700 font-medium">
              Kiến thức
            </Link>
            <Link href="/lien-he" className="block text-gray-700 font-medium">
              Liên hệ
            </Link>

            {/* Mobile Search */}
            <form action="/tim-kiem" method="GET" className="pt-4">
              <input
                type="text"
                name="q"
                placeholder="Tìm sản phẩm..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </form>

            {/* Mobile Buttons */}
            <div className="flex gap-3 pt-4">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl"
              >
                Gọi
              </a>
              <a
                href={siteConfig.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-xl"
              >
                Zalo
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;