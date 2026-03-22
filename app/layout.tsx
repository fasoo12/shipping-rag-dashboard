import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "해운/물류 AI 리서치 대시보드",
  description:
    "AI 기반 해운 및 물류 시장 분석 대시보드 - 실시간 인사이트를 얻으세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  );
}
