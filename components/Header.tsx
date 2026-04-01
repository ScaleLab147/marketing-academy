"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="site-container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-bold text-lg text-text-primary">
            한국마케팅감리협회
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/courses"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            정규강의
          </Link>
          <Link
            href="/testimonials"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            수강생 성과
          </Link>
          <Link
            href="/login"
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            로그인
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-secondary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <div className="px-4 py-4 flex flex-col gap-4">
            <Link
              href="/courses"
              className="text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              정규강의
            </Link>
            <Link
              href="/testimonials"
              className="text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              수강생 성과
            </Link>
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              로그인
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
