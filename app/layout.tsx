import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentHome AZ — Kirayə elanları",
  description: "Azərbaycanda icarə elanları platforması",
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
