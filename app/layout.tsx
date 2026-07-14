import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentHome AZ — Kirayə elanları",
  description: "Azərbaycanda icarə elanları platforması",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
