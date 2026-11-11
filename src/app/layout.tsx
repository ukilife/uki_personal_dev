import type { Metadata } from "next";
import { Fredoka, Lexend } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

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
  title: "Unfold – Personal Development",
  description:
    "Every Week, Unfold a New You. An interactive personal development journey for students.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${lexend.variable} antialiased`}>
      <body className="min-h-screen">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
