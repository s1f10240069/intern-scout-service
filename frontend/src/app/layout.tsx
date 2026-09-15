import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学生スカウトサービス",
  description: "企業と学生をつなぐスカウトサービス",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
