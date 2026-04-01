import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "한국마케팅감리협회 - 마케팅 수익화 전문 교육",
  description:
    "마케팅 수익화의 모든 것. 한국마케팅감리협회에서 실전 마케팅 노하우를 배우고 수익을 만들어보세요.",
  keywords: "마케팅, 수익화, 온라인마케팅, 디지털마케팅, 마케팅교육",
  openGraph: {
    title: "한국마케팅감리협회 - 마케팅 수익화 전문 교육",
    description:
      "마케팅 수익화의 모든 것. 실전 마케팅 노하우를 배우고 수익을 만들어보세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
