import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perfect Market | Designer Marketplace",
  description: "Marketplace for designers and customers to exchange services and products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* TODO: Add Navbar */}
        <main className="min-h-screen bg-background">
          {children}
        </main>
        {/* TODO: Add Footer */}
      </body>
    </html>
  );
}
