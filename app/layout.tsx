import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mordiem - Spotify & YouTube Kontrol",
  description: "Arkadaşlarınızla Spotify şarkılarınızı ve YouTube videolarınızı paylaşın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
