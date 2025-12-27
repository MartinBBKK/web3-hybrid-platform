import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "../components/Web3Provider"; // 👈 引入

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hybrid NFT Platform",
  description: "Web3 + Web2 Hybrid Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 包裹它 */}
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}