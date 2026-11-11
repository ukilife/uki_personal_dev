import type { Metadata } from "next";
import { Fredoka, Lexend } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uki Growth Journey",
  description:
    "Uki Personal Development — an interactive journey for Uki students to discover who they are, one session at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${lexend.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
