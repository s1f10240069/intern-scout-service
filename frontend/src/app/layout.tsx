import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "インターン生スカウトサービス",
  description: "企業とインターン生をつなぐスカウトサービス",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
